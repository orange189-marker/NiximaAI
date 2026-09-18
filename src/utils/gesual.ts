import { 
  ModelOption, 
  SearchGrounding, 
  ThinkingMode, 
} from '../types/chat';
import { 
  StreamCallbacks, 
  StreamChatParams, 
  StreamChatResult,
  extractSearchGrounding,
  generateDefaultGrounding,
  computeDeepThinkingTelemetry,
} from './openrouter';
import { isCjkRequested, isPureSafetyArtifact, sanitizeModelOutput, sanitizeTokenStream } from './textSanitizer';

// Gesual Endpoint: direct connection to friend's AI service (Gesual Cloud)
export const GESUAL_CHAT_ENDPOINT = 'https://gesual.odyssey-mpg.xyz/api/v1/chat';

// Base64 obfuscated custom key (lum_wPXESEz8x3RTYGs9vg8hsCvH1P34JfZLRHAVhjdVwlw)
export const BUILTIN_GESUAL_KEY = atob('bHVtX3dQWEVTRXo4eDNSVFlHczl2Zzhoc0N2SDFQMzRKZlpMUkhBVmhqZFZ3bHc=');

/**
 * Retrieve Gesual API Key in priority order:
 * 1. userCustomKey if it looks like a Gesual key (lum_...)
 * 2. localStorage ('nixima_gesual_key' or 'nixima_openrouter_key' if lum_...)
 * 3. Environment variable VITE_GESUAL_API_KEY
 * 4. Built-in custom key
 */
export function getGesualApiKey(userCustomKey?: string): string {
  if (userCustomKey && userCustomKey.trim().startsWith('lum_')) {
    return userCustomKey.trim();
  }

  if (typeof window !== 'undefined') {
    const fromStorage = localStorage.getItem('nixima_gesual_key');
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();

    const fromGeneric = localStorage.getItem('nixima_openrouter_key');
    if (fromGeneric && fromGeneric.trim().startsWith('lum_')) return fromGeneric.trim();
  }

  const envKey = (import.meta as any).env?.VITE_GESUAL_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) {
    return envKey.trim();
  }

  return BUILTIN_GESUAL_KEY;
}

/**
 * Streams chat completions directly from Gesual Cloud using Server-Sent Events (SSE)
 */
export async function streamGesualChat(params: StreamChatParams): Promise<StreamChatResult> {
  const {
    model,
    messages,
    systemPrompt,
    callbacks,
    signal,
    antiGlitchFilter = true,
    deepThink = false,
    thinkingMode,
    webSearch = false,
    searchMode = 'standard',
    initialSearchGrounding,
    apiKey,
  } = params;

  const activeKey = getGesualApiKey(apiKey);
  const is04 = Boolean(
    (model.id === 'nixima-0.4' || 
    model.generation === '0.4' || 
    (model.id && model.id.startsWith('nixima-0.4'))) &&
    model.id !== 'nixima-0.4e'
  );
  const effectiveThinkingMode: ThinkingMode = is04 
    ? (thinkingMode === 'none' ? 'none' : 'deep')
    : (thinkingMode || (deepThink ? 'deep' : 'none'));
  const allowThinking = Boolean(
    effectiveThinkingMode === 'basic' || 
    effectiveThinkingMode === 'deep' || 
    effectiveThinkingMode === 'ultra' ||
    deepThink || 
    model.isOmni
  );

  const contextForCjk = messages.map(m => m.content).join('\n');
  const allowCjk = isCjkRequested(contextForCjk);

  // Model selection on Gesual: 'Gemini 3.5 Flash-Lite' or 'Gemini 3.8 Flash'
  const primaryModel = model.gesualModel || 'Gemini 3.5 Flash-Lite';
  const candidateModels = [primaryModel, 'Gemini 3.8 Flash'].filter((v, i, a) => a.indexOf(v) === i);

  // Format messages: Gesual passes to Gemini where system instruction is most reliably
  // prepended to the initial user prompt for 100% adherence.
  const formattedMessages: { role: string; content: string }[] = [];
  const systemInstruction = systemPrompt && systemPrompt.trim()
    ? systemPrompt.trim()
    : `You are Nixima AI, operating on ${model.name} (powered by Google Gemini 3.5 Flash-Lite via Gesual Cloud). Deliver ultra-fast, accurate, direct, and high-quality responses. Maintain strict lexical purity in the user's language. When presenting comparisons, rankings, structured metrics, or tabular datasets, format them as standard Markdown tables so they render as rich interactive data tables.`;

  let isFirstUserMsg = true;
  for (const m of messages) {
    if (!m.content || !m.content.trim()) continue;
    if (m.role === 'user' && isFirstUserMsg) {
      formattedMessages.push({
        role: 'user',
        content: `[System Instruction: ${systemInstruction}]\n\n${m.content.trim()}`,
      });
      isFirstUserMsg = false;
    } else {
      formattedMessages.push({
        role: m.role,
        content: m.content.trim(),
      });
    }
  }

  if (isFirstUserMsg) {
    formattedMessages.push({
      role: 'user',
      content: systemInstruction,
    });
  }

  let lastError: Error | null = null;

  for (const candidate of candidateModels) {
    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => {
      abortCtrl.abort(new Error(`Gesual model ${candidate} connection timed out after 20s`));
    }, 20000);

    const onParentAbort = () => abortCtrl.abort(signal?.reason);
    if (signal) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      signal.addEventListener('abort', onParentAbort, { once: true });
    }

    try {
      const response = await fetch(GESUAL_CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: candidate,
          messages: formattedMessages,
          stream: true,
        }),
        signal: abortCtrl.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[Gesual API] ${candidate} returned ${response.status}: ${errorText}`);
        lastError = new Error(`Gesual ${response.status}: ${errorText}`);
        continue; // Try next candidate model on Gesual
      }

      if (!response.body) {
        throw new Error('No response stream received from Gesual.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullContent = '';
      let fullThinking = '';
      let isInsideThinkingTag = false;

      const emitContentToken = () => {
        const streamed = antiGlitchFilter ? sanitizeTokenStream(fullContent, allowCjk) : fullContent;
        if (!isPureSafetyArtifact(fullContent)) {
          callbacks.onToken(streamed);
        }
      };

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
            const jsonStr = trimmed.slice(6);
            try {
              const json = JSON.parse(jsonStr);

              if (json.error) {
                console.warn('[Gesual API] In-stream error:', json.error);
                lastError = new Error(json.error);
                break;
              }

              if (json.type === 'done') {
                break;
              }

              if (json.text) {
                const text = json.text;

                if (text.includes('<think>')) {
                  isInsideThinkingTag = true;
                  const parts = text.split('<think>');
                  if (parts[0]) {
                    fullContent += parts[0];
                    emitContentToken();
                  }
                  if (parts[1] && allowThinking) {
                    fullThinking += parts[1];
                    callbacks.onThinking?.(fullThinking);
                  }
                  continue;
                }

                if (text.includes('</think>')) {
                  isInsideThinkingTag = false;
                  const parts = text.split('</think>');
                  if (parts[0] && allowThinking) {
                    fullThinking += parts[0];
                    callbacks.onThinking?.(fullThinking);
                  }
                  if (parts[1]) {
                    fullContent += parts[1];
                    emitContentToken();
                  }
                  continue;
                }

                if (isInsideThinkingTag) {
                  if (allowThinking) {
                    fullThinking += text;
                    callbacks.onThinking?.(fullThinking);
                  }
                } else {
                  fullContent += text;
                  emitContentToken();
                }
              }
            } catch {
              // Ignore single malformed chunk
            }
          }
        }
      }

      if (fullContent.trim() || (allowThinking && fullThinking.trim())) {
        const sanitizedContent = antiGlitchFilter
          ? sanitizeModelOutput(fullContent, { allowCjk })
          : fullContent;
        const sanitizedThinking = (allowThinking && antiGlitchFilter)
          ? sanitizeModelOutput(fullThinking, { allowCjk })
          : (allowThinking ? fullThinking : '');

        let searchGrounding: SearchGrounding | undefined = initialSearchGrounding;
        let finalContent = sanitizedContent;

        const userPrompt = messages[messages.length - 1]?.content || 'Web Inquiry';
        const extracted = extractSearchGrounding(sanitizedContent, userPrompt, searchMode);
        if (extracted.searchGrounding) {
          searchGrounding = extracted.searchGrounding;
          finalContent = extracted.cleanedContent;
        } else if (!searchGrounding && webSearch) {
          searchGrounding = generateDefaultGrounding(userPrompt, searchMode);
        }

        const allowThinkingReturn = (allowThinking && sanitizedThinking.trim().length > 0);
        const deepThinkingTelemetry = allowThinkingReturn
          ? computeDeepThinkingTelemetry(
              sanitizedThinking, 
              undefined, 
              is04 ? 'deep' : (effectiveThinkingMode !== 'none' ? effectiveThinkingMode : 'deep')
            )
          : undefined;

        return { 
          fullContent: finalContent, 
          fullThinking: allowThinking ? sanitizedThinking : '',
          searchGrounding,
          deepThinkingTelemetry,
        };
      }
    } catch (err: any) {
      if (signal?.aborted || (err.name === 'AbortError' && signal?.aborted)) {
        throw err;
      }
      lastError = err;
      console.warn(`[Gesual API] Failed streaming from ${candidate}:`, err.message);
    } finally {
      clearTimeout(timeout);
      if (signal) {
        signal.removeEventListener('abort', onParentAbort);
      }
    }
  }

  throw lastError || new Error('Gesual AI service was temporarily unavailable.');
}
