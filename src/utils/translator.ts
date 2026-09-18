import { ModelOption, TranslationTone, LinguisticInsight, TranslationRecord } from '../types/chat';
import { streamOpenRouterChat } from './openrouter';
import { getLanguageByCode, detectLanguageFromText } from '../data/languages';

export interface TranslateParams {
  text: string;
  sourceLang: string;
  targetLang: string;
  tone: TranslationTone;
  model: ModelOption;
  callbacks?: {
    onToken?: (token: string) => void;
    onInsights?: (insights: LinguisticInsight) => void;
  };
  signal?: AbortSignal;
  apiKey?: string;
}

export interface TranslateResult {
  translatedText: string;
  detectedSourceLang?: string;
  insights?: LinguisticInsight;
}

/**
 * Executes a high-accuracy neural translation using Nixima's streaming AI model pipeline.
 */
export async function translateTextWithAI(params: TranslateParams): Promise<TranslateResult> {
  const { text, sourceLang, targetLang, tone, model, callbacks, signal, apiKey } = params;

  if (!text.trim()) {
    return { translatedText: '' };
  }

  // Resolve source language
  let resolvedSource = sourceLang;
  if (sourceLang === 'auto') {
    const detected = detectLanguageFromText(text);
    resolvedSource = detected.code;
  }

  const srcLangObj = getLanguageByCode(resolvedSource);
  const tgtLangObj = getLanguageByCode(targetLang);

  // If source and target are identical
  if (resolvedSource.toLowerCase() === targetLang.toLowerCase()) {
    callbacks?.onToken?.(text);
    return {
      translatedText: text,
      detectedSourceLang: resolvedSource,
    };
  }

  const toneInstructions: Record<TranslationTone, string> = {
    standard: 'Natural, fluent, and authentic cadence for general and everyday communication.',
    formal: 'Polished, diplomatic, polite register (e.g. "Ви" in Ukrainian, "Sie" in German, formal honorifics), suited for executive correspondence, legal, and academic contexts.',
    casual: 'Informal, conversational register with authentic colloquialisms and natural conversational flow.',
    technical: 'Strict technical accuracy: preserve all code snippets, markdown fences (```), mathematical symbols, HTML/XML tags, variable names, and domain terminology exactly intact.',
    literary: 'Expressive, stylized phrasing with poetic nuance, aesthetic rhythm, and metaphoric resonance.',
  };

  const systemInstruction = `You are Nixima Translator, the sovereign multilingual neural translation engine of Nixima AI.
YOUR PRIMARY OBJECTIVE:
Translate the input text accurately from ${srcLangObj.name} (${srcLangObj.nativeName}) to ${tgtLangObj.name} (${tgtLangObj.nativeName}).

CRITICAL MANDATES:
1. Tone & Register: Adhere strictly to the requested tone: "${tone.toUpperCase()}" (${toneInstructions[tone]}).
2. Formatting Preservation: Preserve all line breaks, bullet points, numbers, markdown styling, quotes, and punctuation structure.
3. Code & Markdown Invariance: NEVER alter variable names, code blocks, URLs, or markdown syntax.
4. Output Format:
   First, output ONLY the translated text.
   Then, on a new line, if useful linguistic insights can be drawn (synonyms, key terms, cultural context, or phonetic transliteration for non-Latin scripts), output a structured JSON block delimited strictly by \`\`\`insights and \`\`\`:
\`\`\`insights
{
  "synonyms": ["alternative translation 1", "alternative translation 2"],
  "vocabulary": [
    {"term": "key word in target", "pos": "noun/verb/adj", "meaning": "definition in English or Ukrainian"}
  ],
  "culturalContext": "brief cultural or idiomatic explanation if relevant",
  "grammarNotes": ["grammatical structure or concord notes"],
  "transliteration": "phonetic reading in Latin script if target uses non-Latin alphabet (e.g. Cyrillic, Kanji, Hangul, Arabic, Devanagari)"
}
\`\`\``;

  const userPrompt = `[TRANSLATE: ${srcLangObj.name} -> ${tgtLangObj.name} | TONE: ${tone.toUpperCase()}]\n\n${text}`;

  let accumulated = '';
  let mainTranslation = '';
  let rawInsightsStr = '';
  let isParsingInsights = false;

  try {
    const streamResult = await streamOpenRouterChat({
      model,
      messages: [
        { id: 'trans-prompt-' + Date.now(), role: 'user', content: userPrompt, timestamp: Date.now() }
      ],
      systemPrompt: systemInstruction,
      temperature: tone === 'creative' || tone === 'literary' ? 0.6 : 0.2,
      topP: 0.95,
      maxTokens: 4096,
      callbacks: {
        onToken: (chunk) => {
          accumulated = chunk;

          if (accumulated.includes('```insights')) {
            const parts = accumulated.split('```insights');
            mainTranslation = parts[0].trim();
            callbacks?.onToken?.(mainTranslation);

            const jsonPart = parts[1].split('```')[0];
            rawInsightsStr = jsonPart.trim();
          } else {
            mainTranslation = accumulated;
            callbacks?.onToken?.(mainTranslation);
          }
        },
      },
      signal,
      antiGlitchFilter: true,
      apiKey,
    });

    let finalTranslation = mainTranslation || streamResult.fullContent;
    let finalInsights: LinguisticInsight | undefined;

    if (finalTranslation.includes('```insights')) {
      const parts = finalTranslation.split('```insights');
      finalTranslation = parts[0].trim();
      const afterInsights = parts[1].split('```')[0];
      try {
        finalInsights = JSON.parse(afterInsights.trim());
      } catch (e) {
        // parse error ignored
      }
    } else if (rawInsightsStr) {
      try {
        finalInsights = JSON.parse(rawInsightsStr);
      } catch (e) {
        // parse error ignored
      }
    }

    if (finalInsights) {
      callbacks?.onInsights?.(finalInsights);
    }

    return {
      translatedText: finalTranslation.trim(),
      detectedSourceLang: resolvedSource,
      insights: finalInsights,
    };
  } catch (err: any) {
    if (signal?.aborted) throw err;
    console.warn('[Nixima Translator] AI Stream failed, using intelligent algorithmic fallback:', err.message);

    // Fallback: Generate offline/local translation
    const offlineResult = generateOfflineTranslation(text, resolvedSource, targetLang, tone);
    callbacks?.onToken?.(offlineResult.translatedText);
    if (offlineResult.insights) {
      callbacks?.onInsights?.(offlineResult.insights);
    }
    return offlineResult;
  }
}

/**
 * Intelligent algorithmic fallback when network or API key is unavailable
 */
export function generateOfflineTranslation(
  text: string,
  sourceLang: string,
  targetLang: string,
  tone: TranslationTone
): TranslateResult {
  const src = getLanguageByCode(sourceLang);
  const tgt = getLanguageByCode(targetLang);

  // Common phrase pairs dictionary
  const phraseDictionary: Record<string, Record<string, string>> = {
    'hello': { uk: 'Привіт', es: 'Hola', fr: 'Bonjour', de: 'Hallo', it: 'Ciao', pl: 'Cześć', ja: 'こんにちは', zh: '你好', ar: 'مرحبا' },
    'how are you': { uk: 'Як справи?', es: '¿Cómo estás?', fr: 'Comment ça va?', de: 'Wie geht es dir?', it: 'Come stai?', pl: 'Jak się masz?', ja: 'お元気ですか？', zh: '你好吗？', ar: 'كيف حالك؟' },
    'thank you': { uk: 'Дякую', es: 'Gracias', fr: 'Merci', de: 'Danke', it: 'Grazie', pl: 'Dziękuję', ja: 'ありがとうございます', zh: '谢谢', ar: 'شكرا' },
    'good morning': { uk: 'Доброго ранку', es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen', it: 'Buongiorno', pl: 'Dzień dobry', ja: 'おはようございます', zh: '早上好', ar: 'صباح الخير' },
    'good night': { uk: 'Добраніч', es: 'Buenas noches', fr: 'Bonne nuit', de: 'Gute Nacht', it: 'Buonanotte', pl: 'Dobranoc', ja: 'おやすみなさい', zh: '晚安', ar: 'تصبح على خير' },
    'привіт': { en: 'Hello', es: 'Hola', fr: 'Bonjour', de: 'Hallo', pl: 'Cześć', ja: 'こんにちは' },
    'дякую': { en: 'Thank you', es: 'Gracias', fr: 'Merci', de: 'Danke', pl: 'Dziękuję', ja: 'ありがとうございます' },
    'доброго ранку': { en: 'Good morning', es: 'Buenos días', fr: 'Bonjour', de: 'Guten Morgen', pl: 'Dzień dobry' },
  };

  const lower = text.trim().toLowerCase().replace(/[.!?]/g, '');
  if (phraseDictionary[lower] && phraseDictionary[lower][tgt.code]) {
    return {
      translatedText: phraseDictionary[lower][tgt.code],
      detectedSourceLang: sourceLang,
      insights: {
        synonyms: [phraseDictionary[lower][tgt.code]],
        culturalContext: `Standard phrase translated directly from ${src.name} to ${tgt.name}.`,
      }
    };
  }

  // Fallback indicator
  return {
    translatedText: `[${tgt.flag} ${tgt.name} (${tone})]: ${text}`,
    detectedSourceLang: sourceLang,
    insights: {
      synonyms: [`[Alternative ${tgt.name}]: ${text}`],
      culturalContext: `Simulated offline translation into ${tgt.name}. Connect OpenRouter or Gesual Cloud key for full neural translation.`,
    }
  };
}

const STORAGE_KEY_TRANSLATION_HISTORY = 'nixima_translation_history_v1';

export function getStoredTranslationHistory(): TranslationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSLATION_HISTORY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

export function saveTranslationToHistory(record: TranslationRecord): TranslationRecord[] {
  try {
    const existing = getStoredTranslationHistory();
    // Prepend new record, deduplicate identical source texts
    const filtered = existing.filter(r => !(r.sourceText === record.sourceText && r.sourceLang === record.sourceLang && r.targetLang === record.targetLang));
    const updated = [record, ...filtered].slice(0, 100); // keep up to 100 recent
    localStorage.setItem(STORAGE_KEY_TRANSLATION_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [record];
  }
}

export function toggleFavoriteTranslation(id: string): TranslationRecord[] {
  try {
    const existing = getStoredTranslationHistory();
    const updated = existing.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r);
    localStorage.setItem(STORAGE_KEY_TRANSLATION_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function deleteTranslationFromHistory(id: string): TranslationRecord[] {
  try {
    const existing = getStoredTranslationHistory();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY_TRANSLATION_HISTORY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

export function clearTranslationHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_TRANSLATION_HISTORY);
  } catch (e) {
    // ignore
  }
}
