'use client'

import { useState, useEffect } from 'react'
import { Send, Trash2 } from 'lucide-react'
import { getMessages, saveMessages } from '@/lib/database'
import type { Message } from '@/lib/database'

interface InboxSectionProps {
  user: any
}

export default function InboxSection({ user }: InboxSectionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [_activeConversation, _setActiveConversation] = useState<string | null>(null)

  useEffect(() => {
    const storedMessages = getMessages()
    setMessages(storedMessages)
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      recipientId: 'librarian',
      recipientName: 'Library Staff',
      content: messageText,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'message',
    }

    const updated = [...messages, newMessage]
    setMessages(updated)
    saveMessages(updated)
    setMessageText('')

    // Show confirmation
    setTimeout(() => {
      setMessageText('')
    }, 500)
  }

  const userMessages = messages.filter(m => m.senderId === user.id || m.recipientId === user.id)

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id)
    setMessages(updated)
    saveMessages(updated)
  }

  return (
    <div className="inbox-section">
      <h3>📬 Contact Library Staff</h3>

      <div className="inbox-container">
        <div className="inbox-conversation">
          <div className="conversation-header">
            <h4>Conversation with Library Staff</h4>
          </div>

          <div className="messages-list">
            {userMessages.length === 0 ? (
              <div className="empty-inbox">
                <p>No messages yet. Send your first message below!</p>
              </div>
            ) : (
              userMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    <p className="message-sender">
                      {msg.senderId === user.id ? 'You' : msg.senderName}
                    </p>
                    <p className="message-text">{msg.content}</p>
                    <p className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {msg.senderId === user.id && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="message-form">
            <div className="message-input-group">
              <input
                type="text"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="message-input"
              />
              <button type="submit" className="send-btn">
                <Send size={20} />
              </button>
            </div>
            <p className="form-hint">📌 Library staff will respond during office hours</p>
          </form>
        </div>
      </div>
    </div>
  )
}
