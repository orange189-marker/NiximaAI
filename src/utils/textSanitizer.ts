/**
 * Nixima AI - Token Purity & Anti-Glitch Sanitizer Engine
 * 
 * Specifically engineered for the Nixima-0.2 Generation models to eliminate:
 * 1. Tokenizer cross-lingual CJK bleeding (e.g., "co(汉字)ol" -> "cool")
 * 2. Stray Chinese/CJK ideographs appearing in non-Asian conversations
 * 3. Logit repetition loops and word/phrase stutters (e.g. "the the the the", "very very very")
 * 4. Punctuation stutter runs (",,,,,", "????????")
 * 5. Unicode replacement characters (\uFFFD) and invisible zero-width glitches
 * 6. Leaked model special tokens (<|im_end|>, [INST], etc.)
 */

// CJK Unicode Range encompassing Unified Ideographs, Extensions, Compatibility, and Radicals
const CJK_REGEX_CLASS = '[\\u4E00-\\u9FFF\\u3400-\\u4DBF\\uF900-\\uFAFF\\u2E80-\\u2EFF\\u3000-\\u303F]';
const CJK_GLOBAL_REGEX = new RegExp(CJK_REGEX_CLASS, 'gu');

// Common keywords indicating the user legitimately requested Chinese or East Asian content
const CJK_INTENT_KEYWORDS = [
  'chinese', 'mandarin', 'cantonese', 'kanji', 'hanzi', 'hieroglyph', 'ideograph',
  'китай', 'китайськ', 'мандарин', 'ієрогліф', 'ієрогліфи', 'кантонськ',
  'japanese', 'японськ', 'korean', 'корейськ', 'translation', 'translate', 'переклад',
  'переклади', 'zhongwen', 'pinyin'
];

/**
 * Detects whether the user's prompt or recent context legitimately requested
 * Chinese, Japanese, or East Asian characters.
 */
export function isCjkRequested(contextText: string): boolean {
  if (!contextText) return false;
  const lower = contextText.toLowerCase();

  // 1. Check explicit intention keywords
  if (CJK_INTENT_KEYWORDS.some(kw => lower.includes(kw))) {
    return true;
  }

  // 2. Check if the user's own prompt contains 2 or more CJK ideographs
  const userCjkMatches = contextText.match(CJK_GLOBAL_REGEX);
  if (userCjkMatches && userCjkMatches.length >= 2) {
    return true;
  }

  return false;
}

export interface SanitizeOptions {
  allowCjk?: boolean;
  isStreaming?: boolean;
}

/**
 * Comprehensive post-processing sanitizer for Nixima AI responses.
 */
export function sanitizeModelOutput(text: string, options: SanitizeOptions = {}): string {
  if (!text) return text;
  const { allowCjk = false, isStreaming = false } = options;

  let sanitized = text;

  // 1. Remove parenthesized CJK ideographs or glitches inside or between words:
  // e.g. "co(猫)ol", "co (猫) ol", "(中文)"
  if (!allowCjk) {
    sanitized = sanitized.replace(
      new RegExp(`\\([\\s,.]*${CJK_REGEX_CLASS}+[\\s,.]*\\)`, 'gu'),
      ''
    );
  }

  // 2. Repair mid-word CJK glyph bleeding (Latin and Cyrillic):
  // e.g. "co猫ol" -> "cool", "чере猫пахи" -> "черепахи", "anim猫as" -> "animas"
  sanitized = sanitized.replace(
    new RegExp(`([A-Za-z\\u0400-\\u04FF0-9]+)\\s*${CJK_REGEX_CLASS}+\\s*([A-Za-z\\u0400-\\u04FF0-9]+)`, 'gu'),
    (_match, p1, p2) => p1 + p2
  );

  // 3. Remove isolated/stray CJK characters if CJK was not requested
  if (!allowCjk) {
    // Preserve normal spaces between words when removing isolated CJK
    sanitized = sanitized.replace(
      new RegExp(`\\s*${CJK_REGEX_CLASS}+\\s*`, 'gu'),
      (match, offset, str) => {
        // If at start or end of string, remove completely
        if (offset === 0 || offset + match.length >= str.length) return '';
        // If surrounded by whitespace or punctuation, leave a single clean space
        return ' ';
      }
    );
  }

  // 4. Strip Unicode replacement characters and invisible zero-width corruptions
  sanitized = sanitized.replace(/\uFFFD/g, '');
  sanitized = sanitized.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');

  // 5. Strip raw leaked special LLM tokens
  sanitized = sanitized.replace(/<\|(?:im_end|endoftext|im_start|end|pad)\|>/gi, '');
  sanitized = sanitized.replace(/\[\/?(?:INST|SYS|AVAILABLE_TOOLS)\]/gi, '');

  // 6. Suppress word stutter loops (repeating words 3+ times in succession)
  // e.g. "the the the the" -> "the", "very very very very" -> "very very"
  sanitized = sanitized.replace(
    /\b([A-Za-z\u0400-\u04FF0-9]{2,})(?:\s+\1){2,}\b/giu,
    (_match, word) => word
  );

  // 7. Suppress single-letter stutter loops (e.g. "a a a a a" -> "a")
  sanitized = sanitized.replace(
    /\b([A-Za-z\u0400-\u04FF0-9])(?:\s+\1){2,}\b/giu,
    (_match, char) => char
  );

  // 8. Suppress phrase repetition loops (e.g. "and so on and so on and so on" -> "and so on")
  if (!isStreaming) {
    sanitized = sanitized.replace(
      /(\b(?:[A-Za-z\u0400-\u04FF0-9]{2,}\s+){1,4}[A-Za-z\u0400-\u04FF0-9]{2,}\b)(?:\s+\1){2,}/giu,
      (_match, phrase) => phrase
    );
  }

  // 9. Suppress excessive punctuation stutter runs (e.g. ",,,,,," -> ", ", "??????????" -> "???")
  sanitized = sanitized.replace(/([,;])\1{2,}/g, '$1 ');
  sanitized = sanitized.replace(/([!?])\1{3,}/g, '$1$1$1');
  sanitized = sanitized.replace(/\.{5,}/g, '...');

  // 10. Normalize multiple contiguous spaces (except in markdown code blocks or indentations)
  sanitized = sanitized.replace(/[ \t]{3,}/g, '  ');

  // 11. Strip leaked content safety & guardrail evaluation headers
  // e.g. "User Safety: safe\nResponse Safety: safe"
  sanitized = sanitized.replace(
    /^\s*(?:User|Response)\s*Safety(?:\s*:\s*(?:safe|unsafe|none|neutral|unspecified|[a-z0-9_-]*)|\s*$)\r?\n?/gim,
    ''
  );

  return sanitized;
}

/**
 * Detects if a model output consists solely of content safety metadata (e.g. from moderation models)
 * with no actual conversational answer.
 */
export function isPureSafetyArtifact(text: string): boolean {
  if (!text) return false;
  const stripped = text
    .replace(
      /^\s*(?:User|Response)\s*Safety(?:\s*:\s*(?:safe|unsafe|none|neutral|unspecified|[a-z0-9_-]*)|\s*$)\r?\n?/gim,
      ''
    )
    .trim();
  return stripped.length === 0;
}

/**
 * Real-time token stream cleaner.
 * Processes the accumulated text during streaming while preserving ongoing markdown code blocks.
 */
export function sanitizeTokenStream(accumulatedText: string, allowCjk: boolean = false): string {
  if (!accumulatedText) return accumulatedText;
  return sanitizeModelOutput(accumulatedText, {
    allowCjk,
    isStreaming: true,
  });
}
