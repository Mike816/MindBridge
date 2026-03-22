/**
 * MindBridge Backend Server — Multi-chat architecture
 *
 * Data model:
 *   User → has many Chats (each encrypted separately)
 *   User file: { username, salt, hash, chatIds: [...], consent, activeChatId }
 *   Chat file: { id, username, title, messages: [], questionnaires: {}, createdAt, updatedAt }
 */

import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b-instruct-q5_K_M';
const CHATS_DIR = path.join(__dirname, '..', 'data', 'chats');
const USERS_DIR = path.join(__dirname, '..', 'data', 'users');
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

if (!process.env.ENCRYPTION_KEY) console.warn('⚠️  No ENCRYPTION_KEY — data lost on restart!');

await fs.mkdir(CHATS_DIR, { recursive: true });
await fs.mkdir(USERS_DIR, { recursive: true });

// ── Crypto ──────────────────────────────────────────────────
function encrypt(data) {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY, 'hex');
  const c = crypto.createCipheriv('aes-256-gcm', key, iv);
  let e = c.update(JSON.stringify(data), 'utf8', 'hex'); e += c.final('hex');
  return { iv: iv.toString('hex'), data: e, tag: c.getAuthTag().toString('hex') };
}
function decrypt(b) {
  const d = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), Buffer.from(b.iv, 'hex'));
  d.setAuthTag(Buffer.from(b.tag, 'hex'));
  let r = d.update(b.data, 'hex', 'utf8'); r += d.final('utf8');
  return JSON.parse(r);
}
function hashPassword(pw, salt = null) {
  salt = salt || crypto.randomBytes(32).toString('hex');
  return { salt, hash: crypto.pbkdf2Sync(pw, salt, 100000, 64, 'sha512').toString('hex') };
}
function verifyPassword(pw, salt, stored) {
  return crypto.timingSafeEqual(Buffer.from(hashPassword(pw, salt).hash, 'hex'), Buffer.from(stored, 'hex'));
}

// ── Helpers ─────────────────────────────────────────────────
function readBody(req) { return new Promise((r, j) => { const c = []; req.on('data', d => c.push(d)); req.on('end', () => r(Buffer.concat(c).toString())); req.on('error', j); }); }
function json(res, s, d) { const b = JSON.stringify(d); res.writeHead(s, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) }); res.end(b); }
function san(id) { return String(id).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64); }
function sanUser(u) { return String(u).replace(/[^a-zA-Z0-9_.-]/g, '').slice(0, 64).toLowerCase(); }

// ── File I/O ────────────────────────────────────────────────
const chatPath = (id) => path.join(CHATS_DIR, `${san(id)}.enc.json`);
const userPath = (u) => path.join(USERS_DIR, `${sanUser(u)}.enc.json`);

async function save(filepath, data) { await fs.writeFile(filepath, JSON.stringify(encrypt(data))); }
async function load(filepath) {
  try { return decrypt(JSON.parse(await fs.readFile(filepath, 'utf8'))); }
  catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}

async function saveUser(u) { await save(userPath(u.username), u); }
async function loadUser(u) { return load(userPath(sanUser(u))); }
async function saveChat(c) { await save(chatPath(c.id), { ...c, updatedAt: new Date().toISOString() }); }
async function loadChat(id) { return load(chatPath(san(id))); }

// ── Auth tokens ─────────────────────────────────────────────
function createToken(username) {
  const p = JSON.stringify({ username, exp: Date.now() + 7 * 24 * 3600000 });
  return Buffer.from(p).toString('base64') + '.' + crypto.createHmac('sha256', ENCRYPTION_KEY).update(p).digest('hex');
}
function verifyToken(t) {
  try {
    const [b, s] = t.split('.'); const p = Buffer.from(b, 'base64').toString();
    if (!crypto.timingSafeEqual(Buffer.from(s, 'hex'), Buffer.from(crypto.createHmac('sha256', ENCRYPTION_KEY).update(p).digest('hex'), 'hex'))) return null;
    const d = JSON.parse(p); return d.exp > Date.now() ? d : null;
  } catch { return null; }
}
function getAuth(req) { const a = req.headers.authorization; return a?.startsWith('Bearer ') ? verifyToken(a.slice(7)) : null; }

// ── Ollama ──────────────────────────────────────────────────
async function ollamaChat(messages, systemPrompt) {
  const r = await fetch(OLLAMA_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OLLAMA_MODEL, messages: [{ role: 'system', content: systemPrompt }, ...messages], stream: false }) });
  if (!r.ok) throw new Error(`Ollama ${r.status}: ${await r.text()}`);
  return (await r.json()).message?.content || '';
}

// ── Generate chat title from first message ──────────────────
function generateTitle(firstMessage) {
  const text = firstMessage.slice(0, 60);
  return text.length < firstMessage.length ? text + '…' : text;
}

// ── Routes ──────────────────────────────────────────────────
async function handleRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const p = new URL(req.url, `http://${req.headers.host}`).pathname;

  try {
    // ── POST /api/auth/register ───────────────────────────
    if (req.method === 'POST' && p === '/api/auth/register') {
      const { username, password } = JSON.parse(await readBody(req));
      if (!username || !password) return json(res, 400, { error: 'Username and password required' });
      if (password.length < 6) return json(res, 400, { error: 'Password must be at least 6 characters' });
      const clean = sanUser(username);
      if (clean.length < 2) return json(res, 400, { error: 'Username must be at least 2 characters' });
      if (await loadUser(clean)) return json(res, 409, { error: 'Username already taken' });

      const { salt, hash } = hashPassword(password);
      const user = { username: clean, salt, hash, chatIds: [], activeChatId: null, consent: false, createdAt: new Date().toISOString() };
      await saveUser(user);
      return json(res, 201, { token: createToken(clean), username: clean });
    }

    // ── POST /api/auth/login ──────────────────────────────
    if (req.method === 'POST' && p === '/api/auth/login') {
      const { username, password } = JSON.parse(await readBody(req));
      if (!username || !password) return json(res, 400, { error: 'Username and password required' });
      const user = await loadUser(username);
      if (!user || !verifyPassword(password, user.salt, user.hash)) return json(res, 401, { error: 'Invalid username or password' });
      return json(res, 200, { token: createToken(user.username), username: user.username });
    }

    // ── GET /api/auth/me ──────────────────────────────────
    if (req.method === 'GET' && p === '/api/auth/me') {
      const auth = getAuth(req);
      if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const user = await loadUser(auth.username);
      if (!user) return json(res, 401, { error: 'User not found' });
      return json(res, 200, { username: user.username, consent: user.consent, activeChatId: user.activeChatId });
    }

    // ── PUT /api/auth/consent ─────────────────────────────
    if (req.method === 'PUT' && p === '/api/auth/consent') {
      const auth = getAuth(req); if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const user = await loadUser(auth.username); if (!user) return json(res, 404, { error: 'User not found' });
      user.consent = true;
      await saveUser(user);
      return json(res, 200, { ok: true });
    }

    // ── GET /api/chats — list all chats for user ──────────
    if (req.method === 'GET' && p === '/api/chats') {
      const auth = getAuth(req); if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const user = await loadUser(auth.username); if (!user) return json(res, 404, { error: 'User not found' });

      const chats = [];
      for (const id of (user.chatIds || [])) {
        const chat = await loadChat(id);
        if (chat) chats.push({ id: chat.id, title: chat.title, createdAt: chat.createdAt, updatedAt: chat.updatedAt, messageCount: chat.messages?.length || 0 });
      }
      // Sort newest first
      chats.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      return json(res, 200, { chats, activeChatId: user.activeChatId });
    }

    // ── POST /api/chats — create new chat ─────────────────
    if (req.method === 'POST' && p === '/api/chats') {
      const auth = getAuth(req); if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const user = await loadUser(auth.username); if (!user) return json(res, 404, { error: 'User not found' });

      const chatId = crypto.randomUUID();
      const chat = { id: chatId, username: auth.username, title: 'New conversation', messages: [], questionnaires: {}, createdAt: new Date().toISOString() };
      await saveChat(chat);

      user.chatIds = [...(user.chatIds || []), chatId];
      user.activeChatId = chatId;
      await saveUser(user);

      return json(res, 201, { chatId, chat: { id: chatId, title: chat.title, createdAt: chat.createdAt, messageCount: 0 } });
    }

    // ── GET /api/chats/:id — load a specific chat ─────────
    const chatGet = p.match(/^\/api\/chats\/([^/]+)$/);
    if (req.method === 'GET' && chatGet) {
      const auth = getAuth(req); if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const chat = await loadChat(chatGet[1]);
      if (!chat || chat.username !== auth.username) return json(res, 404, { error: 'Chat not found' });

      // Update active chat
      const user = await loadUser(auth.username);
      if (user) { user.activeChatId = chat.id; await saveUser(user); }

      return json(res, 200, { chat });
    }

    // ── PUT /api/chats/:id — update chat metadata ─────────
    const chatPut = p.match(/^\/api\/chats\/([^/]+)$/);
    if (req.method === 'PUT' && chatPut) {
      const auth = getAuth(req); if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const chat = await loadChat(chatPut[1]);
      if (!chat || chat.username !== auth.username) return json(res, 404, { error: 'Chat not found' });
      const body = JSON.parse(await readBody(req));
      if (body.questionnaires) chat.questionnaires = body.questionnaires;
      if (body.title) chat.title = body.title;
      await saveChat(chat);
      return json(res, 200, { ok: true });
    }

    // ── DELETE /api/chats/:id — delete a specific chat ────
    const chatDel = p.match(/^\/api\/chats\/([^/]+)$/);
    if (req.method === 'DELETE' && chatDel) {
      const auth = getAuth(req); if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const id = san(chatDel[1]);
      const user = await loadUser(auth.username); if (!user) return json(res, 404, { error: 'User not found' });

      // Remove from user's list
      user.chatIds = (user.chatIds || []).filter(c => c !== id);
      if (user.activeChatId === id) user.activeChatId = user.chatIds[0] || null;
      await saveUser(user);

      // Delete file
      try { await fs.unlink(chatPath(id)); } catch {}
      return json(res, 200, { ok: true, activeChatId: user.activeChatId });
    }

    // ── POST /api/chat — send message + auto-save ─────────
    if (req.method === 'POST' && p === '/api/chat') {
      const body = JSON.parse(await readBody(req));
      const { messages, systemPrompt, chatId } = body;
      if (!messages || !systemPrompt) return json(res, 400, { error: 'messages and systemPrompt required' });

      const content = await ollamaChat(messages, systemPrompt);

      // Auto-save to chat
      if (chatId) {
        const auth = getAuth(req);
        if (auth) {
          const chat = await loadChat(chatId);
          if (chat && chat.username === auth.username) {
            chat.messages = [...messages, { role: 'assistant', content }];
            // Auto-title from first user message
            if (chat.title === 'New conversation' && messages.length > 0) {
              const firstUser = messages.find(m => m.role === 'user');
              if (firstUser) chat.title = generateTitle(firstUser.content);
            }
            await saveChat(chat);
          }
        }
      }
      return json(res, 200, { content });
    }

    // ── DELETE /api/auth/account ──────────────────────────
    if (req.method === 'DELETE' && p === '/api/auth/account') {
      const auth = getAuth(req); if (!auth) return json(res, 401, { error: 'Not authenticated' });
      const user = await loadUser(auth.username);
      if (user) {
        for (const id of (user.chatIds || [])) { try { await fs.unlink(chatPath(id)); } catch {} }
        try { await fs.unlink(userPath(user.username)); } catch {}
      }
      return json(res, 200, { ok: true });
    }

    // ── GET /api/health ───────────────────────────────────
    if (req.method === 'GET' && p === '/api/health') {
      let ollama = 'unknown';
      try { const r = await fetch('http://localhost:11434/api/tags'); if (r.ok) { const t = await r.json(); ollama = `running (${t.models?.map(m => m.name).join(', ')})`; } } catch { ollama = 'NOT RUNNING'; }
      let chats = 0, users = 0;
      try { chats = (await fs.readdir(CHATS_DIR)).filter(f => f.endsWith('.enc.json')).length; } catch {}
      try { users = (await fs.readdir(USERS_DIR)).filter(f => f.endsWith('.enc.json')).length; } catch {}
      return json(res, 200, { status: 'ok', encryption: 'AES-256-GCM', llm: OLLAMA_MODEL, ollama, chats, users });
    }

    // ── Static files ──────────────────────────────────────
    const DIST = path.join(__dirname, '..', 'dist');
    try {
      await fs.access(DIST);
      const ext = path.extname(p);
      if (ext) { try { const c = await fs.readFile(path.join(DIST, p)); const t = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }; res.writeHead(200, { 'Content-Type': t[ext] || 'application/octet-stream' }); return res.end(c); } catch {} }
      res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(await fs.readFile(path.join(DIST, 'index.html'), 'utf8'));
    } catch {}
    json(res, 404, { error: 'Not found' });
  } catch (err) { console.error(`[${req.method} ${p}]`, err.message); json(res, 500, { error: err.message }); }
}

http.createServer(handleRequest).listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🧠 MindBridge — http://0.0.0.0:${PORT}\n  📡 ${OLLAMA_MODEL}\n  🔒 AES-256-GCM\n`);
});
