const TOKEN_KEY = 'mindbridge_token';
const USER_KEY = 'mindbridge_user';

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getStoredUser() { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } }
export function clearAuth() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }

function saveAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ username }));
}

export function authHeaders() {
  const t = getToken();
  return t ? { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` } : { 'Content-Type': 'application/json' };
}

export async function register(username, password) {
  const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
  const d = await r.json(); if (!r.ok) throw new Error(d.error); saveAuth(d.token, d.username); return d;
}

export async function login(username, password) {
  const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
  const d = await r.json(); if (!r.ok) throw new Error(d.error); saveAuth(d.token, d.username); return d;
}

export async function verifyAuth() {
  const t = getToken(); if (!t) return null;
  try { const r = await fetch('/api/auth/me', { headers: authHeaders() }); if (!r.ok) { clearAuth(); return null; } return await r.json(); }
  catch { clearAuth(); return null; }
}

export async function setConsent() {
  await fetch('/api/auth/consent', { method: 'PUT', headers: authHeaders() });
}

export async function deleteAccount() {
  await fetch('/api/auth/account', { method: 'DELETE', headers: authHeaders() }); clearAuth();
}
