// Vercel Serverless Function: /api/accounts
let memoryUsers = [
  {
    id: "usr-founder",
    name: "Bogdan",
    handle: "bogdan",
    email: "bogdan@nixima.ai",
    passphrase: "nixima2026",
    role: "Founding Operator",
    createdAt: 1700000000000,
    avatarBg: "from-zinc-100 to-zinc-400 text-black",
    credits: 1000
  },
  {
    id: "usr-creator-orange17",
    name: "Orange17 (Creator)",
    handle: "orange17",
    email: "orange17@nixima.ai",
    passphrase: "nixima2026",
    role: "Creator & Lead Architect",
    createdAt: 1700000000000,
    avatarBg: "from-amber-500 to-orange-600 text-white",
    credits: 999999999,
    isCreator: true,
    unlimitedCredits: true
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    const handle = req.query?.handle;
    if (handle) {
      const clean = handle.trim().toLowerCase().replace('@nixima.ai', '');
      const exists = memoryUsers.some(u => u.handle.toLowerCase() === clean);
      return res.status(200).json({ available: !exists && clean.length >= 3, handle: clean });
    }
    return res.status(200).json({ success: true, users: memoryUsers });
  }

  if (req.method === 'POST') {
    const body = req.body || {};
    if (body.user && body.user.handle) {
      const idx = memoryUsers.findIndex(u => u.handle.toLowerCase() === body.user.handle.toLowerCase());
      if (idx >= 0) {
        memoryUsers[idx] = { ...memoryUsers[idx], ...body.user };
      } else {
        memoryUsers.unshift(body.user);
      }
      return res.status(200).json({ success: true, user: body.user, users: memoryUsers });
    }

    if (Array.isArray(body.users)) {
      const map = new Map();
      for (const u of memoryUsers) map.set(u.handle.toLowerCase(), u);
      for (const u of body.users) {
        if (u?.handle) map.set(u.handle.toLowerCase(), u);
      }
      memoryUsers = Array.from(map.values());
      return res.status(200).json({ success: true, users: memoryUsers });
    }
  }

  return res.status(400).json({ error: 'Invalid request' });
}
