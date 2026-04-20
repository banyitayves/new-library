'use client'

import { useState, useEffect } from 'react'
import { Users, BookOpen, LogOut, MessageSquare } from 'lucide-react'
import { getBooks, getChatMessages, saveChatMessages } from '@/lib/database'

interface GuestModeProps {
  onExit: () => void
}

export default function GuestMode({ onExit }: GuestModeProps) {
  const [view, setView] = useState<'books' | 'chat'>('books')
  const [books, setBooks] = useState<any[]>([])
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [guestName, setGuestName] = useState('Guest')
  const [nameSet, setNameSet] = useState(false)

  useEffect(() => {
    setBooks(getBooks())
    setChatMessages(getChatMessages())
  }, [])

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault()
    if (guestName.trim()) {
      setNameSet(true)
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      userId: 'guest',
      userName: guestName,
      userClass: 'Guest',
      content: newMessage,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
    }

    const updated = [message, ...chatMessages]
    setChatMessages(updated)
    saveChatMessages(updated)
    setNewMessage('')
  }

  if (!nameSet) {
    return (
      <div className="guest-name-container">
        <div className="name-card">
          <Users size={48} className="welcome-icon" />
          <h1>Welcome, Guest! 👋</h1>
          <p>What's your name? (optional)</p>
          <form onSubmit={handleSetName}>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
              maxLength={50}
            />
            <button type="submit" className="btn btn-primary">
              Continue to Library
            </button>
          </form>
        </div>

        <style jsx>{`
          .guest-name-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .name-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .welcome-icon {
            color: #667eea;
            margin-bottom: 15px;
          }

          .name-card h1 {
            margin: 15px 0 10px;
            color: #333;
            font-size: 28px;
          }

          .name-card p {
            color: #666;
            margin-bottom: 25px;
          }

          .name-card input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 14px;
            margin-bottom: 15px;
          }

          .name-card input:focus {
            outline: none;
            border-color: #667eea;
          }

          .btn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }

          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="guest-container">
      <div className="guest-header">
        <div className="header-info">
          <h1>GS Busanza Library - Guest Mode</h1>
          <p>Welcome {guestName}! You can browse books and chat with others.</p>
        </div>
        <button onClick={onExit} className="btn btn-secondary">
          <LogOut size={18} />
          Exit Guest Mode
        </button>
      </div>

      <div className="guest-content">
        <div className="view-tabs">
          <button
            onClick={() => setView('books')}
            className={`tab ${view === 'books' ? 'active' : ''}`}
          >
            <BookOpen size={18} />
            Browse Books
          </button>
          <button
            onClick={() => setView('chat')}
            className={`tab ${view === 'chat' ? 'active' : ''}`}
          >
            <MessageSquare size={18} />
            Community Chat
          </button>
        </div>

        {view === 'books' ? (
          <div className="books-section">
            <h2>Available Books</h2>
            <p className="section-note">
              💡 Sign up to borrow books! As a guest, you can only browse.
            </p>

            <div className="books-grid">
              {books.length > 0 ? (
                books.map(book => (
                  <div key={book.id} className="book-card">
                    <div className="book-cover">
                      <BookOpen size={40} />
                    </div>
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                    <p className="category">{book.category}</p>
                    <div className="book-info">
                      <span className="isbn">ISBN: {book.isbn}</span>
                      <span className="availability">
                        {book.availableCopies > 0
                          ? `${book.availableCopies}/${book.copies} available`
                          : 'Not available'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-message">
                  <BookOpen size={48} />
                  <h3>No books available yet</h3>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="chat-section">
            <h2>Community Chat</h2>
            <p className="section-note">
              Join the conversation with other students and teachers!
            </p>

            <div className="messages-container">
              {chatMessages.length > 0 ? (
                chatMessages.map(msg => (
                  <div key={msg.id} className="message">
                    <div className="message-header">
                      <strong>{msg.userName}</strong>
                      {msg.userClass && <span className="class">{msg.userClass}</span>}
                      <span className="time">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="message-content">{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="empty-message">
                  <MessageSquare size={48} />
                  <h3>No messages yet</h3>
                  <p>Be the first to start a conversation!</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share your thoughts..."
                maxLength={500}
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .guest-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .guest-header {
          max-width: 1200px;
          margin: 0 auto 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          color: white;
          gap: 20px;
        }

        .header-info h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .header-info p {
          margin: 0;
          opacity: 0.9;
        }

        .guest-content {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .view-tabs {
          display: flex;
          border-bottom: 2px solid #e0e0e0;
          background: #f9f9f9;
        }

        .tab {
          flex: 1;
          padding: 16px;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 600;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .tab.active {
          color: #667eea;
          border-bottom: 3px solid #667eea;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #667eea;
        }

        .books-section,
        .chat-section {
          padding: 30px;
        }

        .books-section h2,
        .chat-section h2 {
          margin: 0 0 8px;
          color: #333;
          font-size: 24px;
        }

        .section-note {
          color: #667eea;
          background: #f0f5ff;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 25px;
          font-size: 14px;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }

        .book-card {
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s;
          cursor: not-allowed;
        }

        .book-card:hover {
          border-color: #667eea;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
        }

        .book-cover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          height: 100px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 12px;
        }

        .book-card h3 {
          margin: 0 0 8px;
          font-size: 15px;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .author {
          color: #666;
          font-size: 12px;
          margin: 0 0 4px;
        }

        .category {
          color: #999;
          font-size: 11px;
          margin: 0 0 12px;
        }

        .book-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 11px;
          color: #667eea;
        }

        .messages-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding: 15px;
          background: #f9f9f9;
          border-radius: 6px;
        }

        .message {
          background: white;
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #667eea;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .message-header strong {
          color: #333;
        }

        .class {
          background: #f0f5ff;
          color: #667eea;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
        }

        .time {
          color: #999;
          margin-left: auto;
        }

        .message-content {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
        }

        .message-form {
          display: flex;
          gap: 10px;
        }

        .message-form input {
          flex: 1;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
        }

        .message-form input:focus {
          outline: none;
          border-color: #667eea;
        }

        .empty-message {
          text-align: center;
          padding: 40px;
          color: #999;
        }

        .empty-message svg {
          opacity: 0.3;
          margin-bottom: 15px;
        }

        .empty-message h3 {
          margin: 0 0 8px;
          color: #666;
        }

        .empty-message p {
          margin: 0;
          font-size: 14px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: white;
          color: #333;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.9);
        }

        @media (max-width: 768px) {
          .guest-header {
            flex-direction: column;
          }

          .view-tabs {
            flex-direction: column;
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}
