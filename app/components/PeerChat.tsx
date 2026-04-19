'use client'

import { useState, useEffect } from 'react'
import { Send, Heart, MessageCircle, Trash2 } from 'lucide-react'
import { getChatMessages, saveChatMessages } from '@/lib/database'
import type { ChatMessage } from '@/lib/database'

interface PeerChatProps {
  user: any
}

export default function PeerChat({ user }: PeerChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const storedMessages = getChatMessages()
    setMessages(storedMessages)

    // Auto-scroll to bottom
    const element = document.querySelector('.chat-messages')
    if (element) {
      element.scrollTop = element.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userClass: user.class || 'Unknown',
      content: newMessage,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    }

    const updated = [...messages, message]
    setMessages(updated)
    saveChatMessages(updated)
    setNewMessage('')
  }

  const handleLike = (messageId: string) => {
    const updated = messages.map(m =>
      m.id === messageId ? { ...m, likes: m.likes + 1 } : m
    )
    setMessages(updated)
    saveChatMessages(updated)
  }

  const handleDeleteMessage = (messageId: string) => {
    const updated = messages.filter(m => m.id !== messageId)
    setMessages(updated)
    saveChatMessages(updated)
  }

  return (
    <div className="peer-chat-section">
      <h3>💬 Community Chat</h3>
      <p className="chat-subtitle">Chat with other students at GS Busanza</p>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <p>No messages yet. Be the first to say something!</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="chat-message">
                <div className="message-header">
                  <span className="user-name">{msg.userName}</span>
                  <span className="user-class">{msg.userClass}</span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="message-content">{msg.content}</p>
                <div className="message-actions">
                  <button
                    onClick={() => handleLike(msg.id)}
                    className="action-btn like-btn"
                  >
                    <Heart size={16} /> {msg.likes}
                  </button>
                  <button className="action-btn reply-btn">
                    <MessageCircle size={16} /> Reply
                  </button>
                  {msg.userId === user.id && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="action-btn delete-btn"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <div className="chat-input-group">
            <input
              type="text"
              placeholder="Share something with the community..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="chat-input"
              maxLength={280}
            />
            <button type="submit" className="send-btn">
              <Send size={20} />
            </button>
          </div>
          <p className="input-hint">
            {newMessage.length}/280 · Be respectful and follow library guidelines
          </p>
        </form>
      </div>

      <div className="chat-rules">
        <h4>📋 Community Guidelines</h4>
        <ul>
          <li>✓ Be respectful and kind</li>
          <li>✓ Share book recommendations</li>
          <li>✓ Help other students</li>
          <li>✗ No spam or inappropriate content</li>
          <li>✗ No sharing personal information</li>
        </ul>
      </div>
    </div>
  )
}
