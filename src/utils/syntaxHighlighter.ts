import Prism from 'prismjs';

// Load Prism language components
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-yaml';

// Alias mapping for common language identifiers
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  rs: 'rust',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  md: 'markdown',
  yml: 'yaml',
  'c++': 'cpp',
  'c#': 'csharp',
  cs: 'csharp',
};

/**
 * Escapes raw HTML entities safely.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * High-performance, fault-tolerant syntax highlighter for Nixima AI code blocks.
 * Safe to call on partial / streaming code strings.
 */
export function highlightCode(code: string, rawLanguage: string = ''): string {
  if (!code) return '';

  const cleanLang = rawLanguage.toLowerCase().trim();
  const normalizedLang = LANGUAGE_ALIASES[cleanLang] || cleanLang;

  const grammar = Prism.languages[normalizedLang];
  if (!grammar) {
    // Fallback: try markup if it looks like HTML/SVG tags
    if (code.trimStart().startsWith('<')) {
      try {
        return Prism.highlight(code, Prism.languages.markup, 'markup');
      } catch {
        return escapeHtml(code);
      }
    }
    return escapeHtml(code);
  }

  try {
    return Prism.highlight(code, grammar, normalizedLang);
  } catch {
    return escapeHtml(code);
  }
}
