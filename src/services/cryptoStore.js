/**
 * CryptoStore — AES-256-GCM encrypted key-value storage.
 *
 * In production this backs into a server-side encrypted database.
 * For the hackathon demo it uses the Web Crypto API to prove the
 * encryption pipeline works end-to-end in the browser.
 *
 * HIPAA relevance:
 *   - Data at rest is AES-256 encrypted
 *   - Keys are generated per-session and never exported
 *   - Encrypted payloads are opaque byte arrays
 */

class CryptoStore {
  constructor() {
    this._key = null;
  }

  /** Generate (or re-use) a per-session AES-256-GCM key. */
  async _ensureKey() {
    if (this._key) return;
    this._key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      false,               // not extractable
      ['encrypt', 'decrypt'],
    );
  }

  /**
   * Encrypt a JSON-serialisable value.
   * @returns {{ iv: number[], data: number[] }}
   */
  async encrypt(value) {
    await this._ensureKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(value));
    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this._key,
      encoded,
    );
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(cipherBuf)),
    };
  }

  /**
   * Decrypt a bundle previously returned by `encrypt`.
   * @returns {any} The original JSON value.
   */
  async decrypt(bundle) {
    await this._ensureKey();
    const iv = new Uint8Array(bundle.iv);
    const data = new Uint8Array(bundle.data);
    const plainBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this._key,
      data,
    );
    return JSON.parse(new TextDecoder().decode(plainBuf));
  }
}

// Singleton — one store per page session.
const cryptoStore = new CryptoStore();
export default cryptoStore;
