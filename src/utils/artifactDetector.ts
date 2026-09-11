import { NiximaArtifact, ArtifactType } from '../types/chat';

/**
 * Determines whether a code block qualifies as an interactive Nixima Artifact
 */
export function detectArtifactType(language: string, code: string): ArtifactType | null {
  const lang = (language || '').toLowerCase().trim();
  const trimmed = code.trim();

  // SVG Vector Graphic
  if (lang === 'svg' || (trimmed.startsWith('<svg') && trimmed.includes('</svg>'))) {
    return 'svg';
  }

  // React / JSX / TSX
  if (
    ['jsx', 'tsx', 'react'].includes(lang) ||
    (trimmed.includes('import React') || trimmed.includes("from 'react'") || trimmed.includes('from "react"')) ||
    (/\b(?:useState|useEffect|useRef|useMemo|useCallback)\b/.test(trimmed) && /<[a-z0-9]+[^>]*>/i.test(trimmed)) ||
    (/export\s+default\s+function\s+[A-Z]/.test(trimmed) && /<[a-z0-9]+[^>]*>/i.test(trimmed))
  ) {
    return 'react';
  }

  // HTML Web Application
  if (
    ['html', 'htm'].includes(lang) ||
    trimmed.startsWith('<!DOCTYPE html>') ||
    trimmed.startsWith('<!doctype html>') ||
    (trimmed.includes('<html') && trimmed.includes('</html>')) ||
    (trimmed.includes('<body') && trimmed.includes('</body>')) ||
    (trimmed.includes('<div') && (trimmed.includes('<script') || trimmed.includes('<style') || trimmed.includes('class=')))
  ) {
    return 'html';
  }

  // Markdown Document
  if (['markdown', 'md'].includes(lang) && trimmed.length > 120 && (trimmed.includes('# ') || trimmed.includes('## '))) {
    return 'markdown';
  }

  // Standalone code scripts (Python, JS, TS, Rust, CSS, JSON)
  const isRunnableLang = ['javascript', 'js', 'typescript', 'ts', 'python', 'py', 'rust', 'rs', 'bash', 'sh', 'css', 'json'].includes(lang);
  const lineCount = trimmed.split('\n').length;
  if (isRunnableLang && lineCount >= 6) {
    return 'code';
  }

  return null;
}

/**
 * Infers a clean, human-readable title for an artifact
 */
export function inferArtifactTitle(type: ArtifactType, language: string, code: string, index: number = 1): string {
  // 1. Check for explicit comment title: // Title: ..., /* Title: ... */, <!-- Title: ... -->, # Title: ...
  const titleCommentMatch = code.match(/(?:\/\/|#|<!--|\/\*)\s*(?:title|name|app|component):\s*([^\n\r*->]+)/i);
  if (titleCommentMatch && titleCommentMatch[1].trim()) {
    return titleCommentMatch[1].trim();
  }

  // 2. Check for HTML <title>...</title>
  if (type === 'html') {
    const htmlTitleMatch = code.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (htmlTitleMatch && htmlTitleMatch[1].trim()) {
      return htmlTitleMatch[1].trim();
    }
  }

  // 3. Check for React function App() or component name
  if (type === 'react') {
    const compMatch = code.match(/(?:function|class|const)\s+([A-Z][A-Za-z0-9_]*)/);
    if (compMatch && compMatch[1]) {
      return `${compMatch[1]} Component`;
    }
  }

  // 4. Fallbacks by artifact type
  switch (type) {
    case 'html':
      return `Interactive Web App ${index > 1 ? `#${index}` : ''}`.trim();
    case 'react':
      return `React Interactive View ${index > 1 ? `#${index}` : ''}`.trim();
    case 'svg':
      return `Vector Illustration ${index > 1 ? `#${index}` : ''}`.trim();
    case 'markdown':
      return `Document Briefing ${index > 1 ? `#${index}` : ''}`.trim();
    case 'code':
      return `${(language || 'code').toUpperCase()} Script ${index > 1 ? `#${index}` : ''}`.trim();
    default:
      return `Artifact #${index}`;
  }
}

/**
 * Extracts eligible artifacts from message content code fences
 */
export function extractArtifactsFromMessage(content: string, messageId?: string): NiximaArtifact[] {
  const artifacts: NiximaArtifact[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  let artifactIndex = 1;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const lang = (match[1] || 'plaintext').toLowerCase().trim();
    const code = match[2].trimEnd();
    
    // Skip chart JSON blocks as they have their own dedicated NiximaChart component
    if (['chart', 'graph', 'plot', 'nixima-chart', 'dataviz', 'pyramid'].includes(lang)) {
      continue;
    }

    const type = detectArtifactType(lang, code);
    if (type) {
      const title = inferArtifactTitle(type, lang, code, artifactIndex);
      const id = `art_${messageId || 'msg'}_${artifactIndex}_${Date.now() % 10000}`;

      artifacts.push({
        id,
        title,
        type,
        language: lang || 'plaintext',
        content: code,
        versions: [
          {
            version: 1,
            content: code,
            timestamp: Date.now(),
            description: 'Initial generation',
          }
        ],
        currentVersion: 1,
        messageId,
        sourceCodeBlockIdx: artifactIndex - 1,
      });

      artifactIndex++;
    }
  }

  return artifacts;
}

/**
 * Generates an isolated HTML payload to be loaded into the sandboxed iframe
 */
export function generateSandboxHtml(artifact: NiximaArtifact): string {
  const { type, content, language } = artifact;

  // Intercept console logs and errors to post to parent window
  const consoleScript = `
    <script>
      (function() {
        const _origLog = console.log;
        const _origError = console.error;
        const _origWarn = console.warn;
        const _origInfo = console.info;

        function sendToParent(type, args) {
          try {
            const formatted = Array.from(args).map(arg => {
              if (typeof arg === 'object' && arg !== null) {
                try { return JSON.stringify(arg, null, 2); } catch(e) { return String(arg); }
              }
              return String(arg);
            }).join(' ');

            window.parent.postMessage({
              type: 'NIXIMA_CANVAS_CONSOLE',
              payload: {
                type: type,
                message: formatted,
                timestamp: Date.now()
              }
            }, '*');
          } catch(e) {}
        }

        console.log = function(...args) { _origLog.apply(console, args); sendToParent('log', args); };
        console.error = function(...args) { _origError.apply(console, args); sendToParent('error', args); };
        console.warn = function(...args) { _origWarn.apply(console, args); sendToParent('warn', args); };
        console.info = function(...args) { _origInfo.apply(console, args); sendToParent('info', args); };

        window.onerror = function(msg, url, line, col, error) {
          sendToParent('error', ['Runtime Error: ' + msg + (line ? ' (Line: ' + line + ')' : '')]);
          return false;
        };
      })();
    </script>
  `;

  // 1. SVG
  if (type === 'svg') {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artifact.title}</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #09090b;
      background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
      background-size: 20px 20px;
      color: #fafafa;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-sizing: border-box;
    }
    svg {
      max-width: 100%;
      height: auto;
      filter: drop-shadow(0 10px 25px rgba(0,0,0,0.5));
    }
  </style>
</head>
<body>
  ${consoleScript}
  ${content}
</body>
</html>`;
  }

  // 2. Full HTML Document
  if (type === 'html') {
    // If it already contains a full html shell, inject Tailwind CDN and console script
    if (content.toLowerCase().includes('<html')) {
      let html = content;
      if (!html.includes('cdn.tailwindcss.com')) {
        html = html.replace('<head>', '<head>\\n  <script src="https://cdn.tailwindcss.com"></script>');
      }
      return html.replace('<body>', `<body>\\n${consoleScript}`);
    }

    // Wrap partial HTML snippet
    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artifact.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              cyan: '#06b6d4',
              purple: '#8b5cf6',
              orange: '#f97316'
            }
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 16px;
      background-color: #09090b;
      color: #fafafa;
      min-height: 100vh;
      box-sizing: border-box;
    }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 antialiased">
  ${consoleScript}
  ${content}
</body>
</html>`;
  }

  // 3. React / JSX / TSX
  if (type === 'react') {
    // Clean imports from the code (since in browser standalone they come from window.React, window.ReactDOM)
    let reactCode = content
      .replace(/import\\s+.*?from\\s+['"].*?['"];?/g, '')
      .replace(/export\\s+default\\s+/g, '')
      .replace(/export\\s+/g, '');

    // Identify the component name to mount
    const compMatch = content.match(/(?:function|class|const)\\s+([A-Z][A-Za-z0-9_]*)/);
    const componentName = compMatch ? compMatch[1] : 'App';

    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${artifact.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 16px;
      background-color: #09090b;
      color: #fafafa;
      min-height: 100vh;
    }
  </style>
</head>
<body class="bg-zinc-950 text-zinc-100 antialiased">
  ${consoleScript}
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } = React;

    try {
      ${reactCode}

      const rootElement = document.getElementById('root');
      if (typeof ${componentName} !== 'undefined') {
        ReactDOM.render(<${componentName} />, rootElement);
      } else {
        rootElement.innerHTML = '<div style="color:#ef4444;font-family:monospace;padding:16px;">Error: Component ${componentName} not defined.</div>';
      }
    } catch (err) {
      console.error(err);
      document.getElementById('root').innerHTML = '<div style="color:#ef4444;font-family:monospace;padding:16px;">Runtime Exception: ' + err.message + '</div>';
    }
  </script>
</body>
</html>`;
  }

  // 4. JavaScript / TypeScript Execution Sandbox
  if (type === 'code' && (language === 'javascript' || language === 'js' || language === 'typescript' || language === 'ts')) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${artifact.title}</title>
  <style>
    body {
      background: #09090b;
      color: #e4e4e7;
      font-family: monospace;
      padding: 16px;
      margin: 0;
    }
    #output {
      white-space: pre-wrap;
      font-size: 13px;
      line-height: 1.5;
    }
    .log-line { border-bottom: 1px solid #27272a; padding: 4px 0; }
    .log-error { color: #f87171; }
    .log-warn { color: #fbbf24; }
    .log-info { color: #60a5fa; }
  </style>
</head>
<body>
  ${consoleScript}
  <div style="font-size:11px;color:#71717a;margin-bottom:12px;text-transform:uppercase;letter-spacing:0.05em;">Console Standard Output:</div>
  <div id="output"></div>
  <script>
    const outDiv = document.getElementById('output');
    function appendLog(text, className) {
      const el = document.createElement('div');
      el.className = 'log-line ' + (className || '');
      el.textContent = text;
      outDiv.appendChild(el);
    }
    const origLog = console.log;
    console.log = function(...args) {
      origLog.apply(console, args);
      appendLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    };
    console.error = function(...args) {
      appendLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'log-error');
    };
    console.warn = function(...args) {
      appendLog(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '), 'log-warn');
    };

    try {
      ${content}
    } catch(err) {
      console.error(err.name + ': ' + err.message);
    }
  </script>
</body>
</html>`;
  }

  // 5. Default Fallback
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${artifact.title}</title>
  <style>
    body {
      background: #09090b;
      color: #e4e4e7;
      font-family: monospace;
      padding: 24px;
      margin: 0;
      white-space: pre-wrap;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  ${consoleScript}
  ${content}
</body>
</html>`;
}
