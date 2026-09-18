export interface ParsedSearchToolCall {
  isToolCall: boolean;
  query?: string;
  raw?: string;
}

/**
 * Detects if a model output is a raw search tool call, such as:
 * { "type": "search", "query": "China GDP 2026" }
 * or ```json { "type": "search", "query": "..." } ```
 */
export function parseSearchToolCall(content: string): ParsedSearchToolCall {
  if (!content) return { isToolCall: false };
  const trimmed = content.trim();

  // Pattern 1: Fenced code block with JSON search tool call
  // e.g. ```json\n{\n  "type": "search",\n  "query": "China GDP 2026"\n}\n```
  const fencedMatch = /```(?:json)?\s*(\{\s*[\s\S]*?"(?:type|action|tool|name)"\s*:\s*"search"[\s\S]*?\})\s*```/i.exec(trimmed);
  if (fencedMatch && fencedMatch[1]) {
    try {
      const parsed = JSON.parse(fencedMatch[1]);
      const q = parsed.query || parsed.q || parsed.search_query || parsed.input;
      if (q && typeof q === 'string') {
        return { isToolCall: true, query: q.trim(), raw: fencedMatch[0] };
      }
    } catch { /* ignore parse error */ }
  }

  // Pattern 2: Raw JSON object (start and end with braces)
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      const isSearchType = 
        parsed.type === 'search' || 
        parsed.action === 'search' || 
        parsed.tool === 'search' ||
        parsed.name === 'search';
      const q = parsed.query || parsed.q || parsed.search_query || parsed.input;
      if (isSearchType && q && typeof q === 'string') {
        return { isToolCall: true, query: q.trim(), raw: trimmed };
      }
    } catch { /* ignore parse error */ }
  }

  // Pattern 3: Embedded tool call snippet occupying the main response
  const embeddedMatch = /\{\s*"(?:type|action|tool|name)"\s*:\s*"search"\s*,\s*"(?:query|q|search_query|input)"\s*:\s*"([^"]+)"\s*\}/i.exec(trimmed);
  if (embeddedMatch && embeddedMatch[1]) {
    return { isToolCall: true, query: embeddedMatch[1].trim(), raw: embeddedMatch[0] };
  }

  return { isToolCall: false };
}
