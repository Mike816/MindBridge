import React, { useState } from 'react';
import '../styles/ChatList.css';

export default function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  onClose,
}) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    if (confirmDelete === chatId) {
      onDeleteChat(chatId);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(chatId);
    }
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className={`chat-list-panel ${isOpen ? 'open' : ''}`}>
      <div className="chat-list-header">
        <h3>Conversations</h3>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="chat-list-new-btn" onClick={onNewChat}>
            + New
          </button>
          <button className="chat-list-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="chat-list-items">
        {chats.length === 0 && (
          <div className="chat-list-empty">
            <p>No conversations yet.</p>
            <p>Start a new one to begin.</p>
          </div>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-list-item ${chat.id === activeChatId ? 'active' : ''}`}
            onClick={() => { onSelectChat(chat.id); onClose(); }}
          >
            <div className="chat-list-item-info">
              <div className="chat-list-item-title">{chat.title}</div>
              <div className="chat-list-item-meta">
                {chat.messageCount > 0 ? `${chat.messageCount} messages` : 'Empty'}
                {' · '}
                {formatDate(chat.updatedAt || chat.createdAt)}
              </div>
            </div>

            <div className="chat-list-item-actions">
              {confirmDelete === chat.id ? (
                <>
                  <button className="chat-delete-confirm" onClick={(e) => handleDelete(e, chat.id)}>
                    Delete
                  </button>
                  <button className="chat-delete-cancel" onClick={cancelDelete}>
                    ✕
                  </button>
                </>
              ) : (
                <button className="chat-delete-btn" onClick={(e) => handleDelete(e, chat.id)} title="Delete chat">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
