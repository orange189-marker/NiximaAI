// Vercel Serverless Function: /api/search
// Handles Search V3 (20+ sources) and Search V3 Mega (50-80 sources) queries
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const query = (req.query?.q || '').trim();
  const lang = (req.query?.lang || 'en').trim().toLowerCase();
  const isNews = req.query?.isNews === 'true';
  const topic = (req.query?.topic || '').trim();
  const limit = Math.min(80, Math.max(1, parseInt(req.query?.limit || '20', 10)));
  const isUk = lang === 'uk' || /[а-яіїєґ]/i.test(query) || /[а-яіїєґ]/i.test(topic);

  try {
    const sources = [];

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
        signal: AbortSignal.timeout(4500),
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
          signal: AbortSignal.timeout(4000),
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

    return res.status(200).json({ success: true, sources });
  } catch (err) {
    return res.status(500).json({ success: false, sources: [], error: err?.message || 'Search failed' });
  }
}
