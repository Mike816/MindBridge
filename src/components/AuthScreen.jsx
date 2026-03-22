import React, { useState } from 'react';
import { Lock, Shield } from './Icons';
import '../styles/Disclosure.css';

export default function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login'); // login | register
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!username.trim() || !password) {
      return setError('Please enter a username and password.');
    }
    if (mode === 'register' && password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (mode === 'register' && password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      await onAuth(mode, username.trim(), password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="disclosure-card fade-up" style={{ maxWidth: '420px' }}>
      <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
      <p className="subtitle">
        {mode === 'login'
          ? 'Sign in to continue your session. Your data is encrypted and private.'
          : 'Create an account to save your progress. Your data is encrypted with AES-256.'}
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <span className="arch-badge green"><Lock size={12} /> Encrypted Storage</span>
        <span className="arch-badge green"><Shield size={12} /> PBKDF2 Hashed</span>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-dim)',
          border: '1px solid rgba(232,92,92,0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '13px',
          color: '#f0a0a0',
          marginBottom: '16px',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Choose a username"
            autoComplete="username"
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 14px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>

        {mode === 'register' && (
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Confirm your password"
              autoComplete="new-password"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                color: 'var(--text)',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button
          className="btn btn-ghost"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
        >
          {mode === 'login' ? 'Need an account?' : 'Already have one?'}
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>
    </div>
  );
}
