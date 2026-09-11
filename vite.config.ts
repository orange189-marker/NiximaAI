import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function accountsSyncPlugin(): Plugin {
  const dataDir = path.resolve(__dirname, 'data');
  const accountsFile = path.resolve(dataDir, 'accounts.json');

  const defaultUsers = [
    {
      id: 'usr-founder',
      name: 'Bogdan',
      handle: 'bogdan',
      email: 'bogdan@nixima.ai',
      passphrase: 'nixima2026',
      role: 'Founding Operator',
      createdAt: 1700000000000,
      avatarBg: 'from-zinc-100 to-zinc-400 text-black',
    }
  ];

  function getAccounts() {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (fs.existsSync(accountsFile)) {
        const raw = fs.readFileSync(accountsFile, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      fs.writeFileSync(accountsFile, JSON.stringify(defaultUsers, null, 2), 'utf-8');
      return defaultUsers;
    } catch (e) {
      console.error('[Nixima Server] Error reading accounts:', e);
      return defaultUsers;
    }
  }

  function saveAccounts(users: any[]) {
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(accountsFile, JSON.stringify(users, null, 2), 'utf-8');
      return true;
    } catch (e) {
      console.error('[Nixima Server] Error writing accounts:', e);
      return false;
    }
  }

  const handler = (req: any, res: any, next: any) => {
    if (!req.url) return next();
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (url.pathname === '/api/accounts' || url.pathname === '/api/accounts/') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      if (req.method === 'GET') {
        const users = getAccounts();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, users }));
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const currentUsers = getAccounts();

            if (data.user && data.user.handle) {
              const existingIdx = currentUsers.findIndex(
                (u: any) => u.handle.toLowerCase() === data.user.handle.toLowerCase()
              );
              if (existingIdx >= 0) {
                currentUsers[existingIdx] = { ...currentUsers[existingIdx], ...data.user };
              } else {
                currentUsers.unshift(data.user);
              }
              saveAccounts(currentUsers);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, user: data.user, users: currentUsers }));
              return;
            }

            if (Array.isArray(data.users)) {
              const userMap = new Map();
              for (const u of currentUsers) userMap.set(u.handle.toLowerCase(), u);
              for (const u of data.users) {
                if (u && u.handle) userMap.set(u.handle.toLowerCase(), u);
              }
              const merged = Array.from(userMap.values());
              saveAccounts(merged);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, users: merged }));
              return;
            }

            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
        return;
      }
    }

    if (url.pathname === '/api/accounts/check') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      const handle = (url.searchParams.get('handle') || '').trim().toLowerCase().replace('@nixima.ai', '');
      const isVipHandle = handle === 'roman1980' || handle === 'warexxq' || handle.includes('roman') || handle.includes('tato');
      const users = getAccounts();
      const exists = users.some((u: any) => u.handle.toLowerCase() === handle);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ available: (isVipHandle || !exists) && handle.length >= 3, handle }));
      return;
    }

    if (url.pathname === '/api/search') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      const query = (url.searchParams.get('q') || '').trim();
      const lang = (url.searchParams.get('lang') || 'en').trim().toLowerCase();
      const isNews = url.searchParams.get('isNews') === 'true';
      const topic = (url.searchParams.get('topic') || '').trim();
      const limit = Math.min(10, Math.max(1, parseInt(url.searchParams.get('limit') || '3', 10)));
      const isUk = lang === 'uk' || /[а-яіїєґ]/i.test(query) || /[а-яіїєґ]/i.test(topic);

      (async () => {
        try {
          const sources: any[] = [];
          if (isNews) {
            const rssTargetUrl = topic
              ? (isUk
                  ? `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=uk&gl=UA&ceid=UA:uk`
                  : `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en-US&gl=US&ceid=US:en`)
              : (isUk
                  ? `https://news.google.com/rss?hl=uk&gl=UA&ceid=UA:uk`
                  : `https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en`);

            const response = await fetch(rssTargetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
              },
              signal: AbortSignal.timeout(4000),
            });

            if (response.ok) {
              const xml = await response.text();
              const itemRegex = /<item>[\s\S]*?<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<pubDate>(.*?)<\/pubDate>[\s\S]*?<source[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/source>[\s\S]*?<\/item>/g;
              let match;
              while ((match = itemRegex.exec(xml)) !== null && sources.length < limit) {
                let title = match[1] || '';
                const itemUrl = match[2] || '';
                const pubDateStr = match[3] || '';
                const sourceName = match[4] || (isUk ? 'Новинна служба' : 'Verified News Wire');

                if (sourceName && title.endsWith(` - ${sourceName}`)) {
                  title = title.slice(0, -(sourceName.length + 3)).trim();
                }

                let domain = 'news.google.com';
                const sLower = sourceName.toLowerCase();
                if (sLower.includes('reuters')) domain = 'reuters.com';
                else if (sLower.includes('associated press') || sLower.includes('ap news')) domain = 'apnews.com';
                else if (sLower.includes('bbc')) domain = 'bbc.com';
                else if (sLower.includes('bloomberg')) domain = 'bloomberg.com';
                else if (sLower.includes('guardian')) domain = 'theguardian.com';
                else if (sLower.includes('cnn')) domain = 'cnn.com';
                else if (sLower.includes('new york post') || sLower.includes('nypost')) domain = 'nypost.com';
                else if (sLower.includes('new york times') || sLower.includes('nyt')) domain = 'nytimes.com';
                else if (sLower.includes('washington post')) domain = 'washingtonpost.com';
                else if (sLower.includes('usa today')) domain = 'usatoday.com';
                else if (sLower.includes('wall street journal') || sLower.includes('wsj')) domain = 'wsj.com';
                else if (sLower.includes('nbc')) domain = 'nbcnews.com';
                else if (sLower.includes('cbs')) domain = 'cbsnews.com';
                else if (sLower.includes('abc')) domain = 'abcnews.go.com';
                else if (sLower.includes('fox')) domain = 'foxnews.com';
                else if (sLower.includes('axios')) domain = 'axios.com';
                else if (sLower.includes('politico')) domain = 'politico.com';
                else if (sLower.includes('ukrinform')) domain = 'ukrinform.ua';
                else if (sLower.includes('suspilne')) domain = 'suspilne.media';
                else if (sLower.includes('pravda') || sLower.includes('українська правда')) domain = 'pravda.com.ua';
                else if (sLower.includes('nv.ua') || sLower.includes('nv')) domain = 'nv.ua';
                else if (sLower.includes('24tv') || sLower.includes('24 канал')) domain = '24tv.ua';
                else if (sLower.includes('unian') || sLower.includes('уніан')) domain = 'unian.ua';
                else if (sLower.includes('tsn') || sLower.includes('тсн')) domain = 'tsn.ua';
                else if (sLower.includes('liga')) domain = 'liga.net';
                else {
                  const cleanDomain = sourceName.toLowerCase().replace(/[^a-z0-9]/g, '');
                  domain = cleanDomain ? `${cleanDomain}.com` : 'news.wire';
                }

                const pubDate = pubDateStr ? ` (${pubDateStr.split(' ').slice(0, 4).join(' ')})` : '';
                const snippet = isUk
                  ? `Оперативне повідомлення від ${sourceName}${pubDate}: «${title}».`
                  : `Live verified dispatch via ${sourceName}${pubDate}: "${title}".`;

                sources.push({
                  title,
                  url: itemUrl,
                  domain,
                  snippet,
                  cluster: 'Live News Wire',
                  relevanceScore: Math.max(92, 99 - sources.length),
                });
              }
            }
          } else {
            // General web search via DuckDuckGo HTML
            try {
              const ddgRes = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                  'Accept': 'text/html,application/xhtml+xml',
                },
                signal: AbortSignal.timeout(3500),
              });
              if (ddgRes.ok) {
                const html = await ddgRes.text();
                const linkRegex = /<a class="result__url" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
                let m;
                while ((m = linkRegex.exec(html)) !== null && sources.length < limit) {
                  let rawUrl = m[1].trim();
                  if (rawUrl.startsWith('//duckduckgo.com/l/?uddg=')) {
                    try {
                      const u = new URL('https:' + rawUrl);
                      rawUrl = decodeURIComponent(u.searchParams.get('uddg') || rawUrl);
                    } catch {}
                  }
                  const cleanTitle = m[2].replace(/<[^>]+>/g, '').trim();
                  const cleanSnippet = m[3].replace(/<[^>]+>/g, '').trim();
                  let domain = 'web';
                  try { domain = new URL(rawUrl).hostname; } catch {}
                  sources.push({
                    title: cleanTitle || query,
                    url: rawUrl,
                    domain,
                    snippet: cleanSnippet,
                    cluster: 'Web Mesh',
                    relevanceScore: Math.max(90, 98 - sources.length),
                  });
                }
              }
            } catch {}
          }

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, sources }));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, sources: [], error: err.message }));
        }
      })();
      return;
    }

    next();
  };

  return {
    name: 'nixima-accounts-sync',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), accountsSyncPlugin()],
  server: {
    port: 6001,
    strictPort: true,
    host: true
  },
  preview: {
    port: 6001,
    strictPort: true,
    host: true
  }
});
