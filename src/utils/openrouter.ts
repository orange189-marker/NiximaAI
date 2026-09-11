import { ModelOption } from '../types/chat';
import { isCjkRequested, sanitizeModelOutput, sanitizeTokenStream } from './textSanitizer';

// Pre-configured system key inserted directly into the runtime
const BUILTIN_SYSTEM_KEY = atob('c2stb3ItdjEtZjc1NWEzZDcyMTVjMDYzYzA3ZWFiZmJmZWQ2MWE4YzNlMjBiMDQzZTcyY2MxNGYxOTQzMDc5YjczYzIwY2M4OQ==');

export const getSystemApiKey = (): string => {
  return BUILTIN_SYSTEM_KEY;
};

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onThinking: (thinking: string) => void;
}

export interface StreamChatParams {
  model: ModelOption;
  messages: { role: string; content: string }[];
  systemPrompt?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  callbacks: StreamCallbacks;
  signal?: AbortSignal;
  antiGlitchFilter?: boolean;
}

/**
 * Stream chat completions directly from OpenRouter using Server-Sent Events (SSE)
 */
export async function streamOpenRouterChat({
  model,
  messages,
  systemPrompt,
  temperature = 0.7,
  topP = 0.95,
  maxTokens = 4096,
  callbacks,
  signal,
  antiGlitchFilter = true,
}: StreamChatParams): Promise<{ fullContent: string; fullThinking: string }> {
  const activeKey = getSystemApiKey();

  // Determine if the conversation legitimately requests CJK characters
  const contextForCjk = messages.map(m => m.content).join('\n');
  const allowCjk = isCjkRequested(contextForCjk);

  // Determine primary model and fallbacks
  const primarySlug = model.openRouterModel || 'openrouter/free';
  const fallbacks = model.fallbackModels || [
    'openrouter/free',
    'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    'nvidia/nemotron-3.5-lightning:free'
  ];
  const candidates = [primarySlug, ...fallbacks.filter(f => f !== primarySlug)];

  // Prepare full message history with system instructions
  const formattedMessages: { role: string; content: string }[] = [];
  if (systemPrompt && systemPrompt.trim()) {
    formattedMessages.push({
      role: 'system',
      content: systemPrompt.trim()
    });
  } else {
    formattedMessages.push({
      role: 'system',
      content: `Identity: You are Nixima AI, operating on ${model.name}. Deliver accurate, direct, and high-quality responses. Maintain strict lexical purity in the user's language. Never output stray Chinese ideographs, token stutters, or repetition loops. When presenting comparisons, rankings, structured metrics, or tabular datasets, format them as standard Markdown tables (| Col 1 | Col 2 |\\n|---|---|) so they render as rich interactive data tables.`
    });
  }

  // Include conversation messages
  formattedMessages.push(...messages);

  let lastError: Error | null = null;

  for (const candidateModel of candidates) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://nixima.ai',
          'X-Title': 'Nixima AI',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: candidateModel,
          messages: formattedMessages,
          temperature,
          top_p: topP,
          max_tokens: maxTokens,
          stream: true,
        }),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Nixima Core] Model ${candidateModel} returned ${response.status}: ${errorText}. Attempting fallback...`);
        lastError = new Error(`HTTP ${response.status}: ${errorText}`);
        continue; // Try next candidate model
      }

      if (!response.body) {
        throw new Error('No response body stream received.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullContent = '';
      let fullThinking = '';
      let isInsideThinkingTag = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith(':')) continue;
          if (trimmed === 'data: [DONE]') break;

          if (trimmed.startsWith('data: ')) {
            try {
              const json = JSON.parse(trimmed.slice(6));
              const delta = json.choices?.[0]?.delta;
              if (!delta) continue;

              // Handle reasoning field if returned by model
              if (delta.reasoning) {
                fullThinking += delta.reasoning;
                callbacks.onThinking(fullThinking);
              }

              // Handle standard content tokens
              if (delta.content) {
                const text = delta.content;

                // Handle <think> tags from thinking models
                if (text.includes('<think>')) {
                  isInsideThinkingTag = true;
                  const parts = text.split('<think>');
                  if (parts[0]) {
                    fullContent += parts[0];
                    callbacks.onToken(antiGlitchFilter ? sanitizeTokenStream(fullContent, allowCjk) : fullContent);
                  }
                  if (parts[1]) {
                    fullThinking += parts[1];
                    callbacks.onThinking(fullThinking);
                  }
                  continue;
                }

                if (text.includes('</think>')) {
                  isInsideThinkingTag = false;
                  const parts = text.split('</think>');
                  if (parts[0]) {
                    fullThinking += parts[0];
                    callbacks.onThinking(fullThinking);
                  }
                  if (parts[1]) {
                    fullContent += parts[1];
                    callbacks.onToken(antiGlitchFilter ? sanitizeTokenStream(fullContent, allowCjk) : fullContent);
                  }
                  continue;
                }

                if (isInsideThinkingTag) {
                  fullThinking += text;
                  callbacks.onThinking(fullThinking);
                } else {
                  fullContent += text;
                  callbacks.onToken(antiGlitchFilter ? sanitizeTokenStream(fullContent, allowCjk) : fullContent);
                }
              }
            } catch (err) {
              // Ignore single malformed chunk
            }
          }
        }
      }

      // If we got content, return successfully with full token sanitization applied
      if (fullContent.trim() || fullThinking.trim()) {
        const sanitizedContent = antiGlitchFilter
          ? sanitizeModelOutput(fullContent, { allowCjk })
          : fullContent;
        const sanitizedThinking = antiGlitchFilter
          ? sanitizeModelOutput(fullThinking, { allowCjk })
          : fullThinking;

        return { fullContent: sanitizedContent, fullThinking: sanitizedThinking };
      }
    } catch (e: any) {
      if (e.name === 'AbortError') {
        throw e;
      }
      lastError = e;
      console.warn(`[Nixima Core] Failed streaming from ${candidateModel}:`, e.message);
    }
  }

  throw lastError || new Error('All model endpoints were temporarily unavailable. Please try again.');
}
