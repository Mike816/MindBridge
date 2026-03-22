import React, { useState } from 'react';
import { Brain, Lock } from './Icons';
import '../styles/Header.css';

export default function Header({ username, onLogout, onDeleteAccount, onToggleChatList }) {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleConfirm = () => {
    if (confirmAction === 'account' && onDeleteAccount) onDeleteAccount();
    setConfirmAction(null);
    setShowMenu(false);
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        {onToggleChatList && (
          <button className="hamburger-btn" onClick={onToggleChatList} title="Conversations">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
        <Brain />
        <span className="header-title">MindBridge</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        {username && (
          <div className="header-user-area">
            <button className="header-user-btn" onClick={() => { setShowMenu(!showMenu); setConfirmAction(null); }}>
              <span className="header-user-avatar">{username[0].toUpperCase()}</span>
              <span className="header-username">{username}</span>
            </button>
            {showMenu && (
              <div className="header-dropdown">
                {confirmAction ? (
                  <div className="header-dropdown-confirm">
                    <p>This will permanently delete your account and all conversations. This cannot be undone.</p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      <button className="header-confirm-yes" onClick={handleConfirm}>Delete Account</button>
                      <button className="header-confirm-no" onClick={() => setConfirmAction(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {onDeleteAccount && <button className="header-dropdown-item danger" onClick={() => setConfirmAction('account')}>Delete Account</button>}
                    {onLogout && <button className="header-dropdown-item" onClick={() => { onLogout(); setShowMenu(false); }}>Sign Out</button>}
                  </>
                )}
              </div>
            )}
          </div>
        )}
        <div className="header-badge"><Lock size={12} />HIPAA Compliant</div>
      </div>
    </header>
  );
}
