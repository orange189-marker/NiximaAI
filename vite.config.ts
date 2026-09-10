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
