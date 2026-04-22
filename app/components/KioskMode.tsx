'use client'

import { useState, useEffect } from 'react'
import { BookOpen, MessageSquare, Users, LogOut, Home, Plus } from 'lucide-react'
import { getBooks, getTransactions, borrowBook } from '@/lib/database'
import InboxSection from './InboxSection'
import PeerChat from './PeerChat'
import type { Book, Transaction } from '@/lib/database'

interface KioskModeProps {
  user: any
  onLogout: () => void
  onBackToMain: () => void
}

export default function KioskMode({ user, onLogout, onBackToMain }: KioskModeProps) {
  const [activeTab, setActiveTab] = useState('borrow')
  const [books, setBooks] = useState<Book[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentBooks, setCurrentBooks] = useState<string[]>([])
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const storedBooks = getBooks()
    const storedTransactions = getTransactions()
    setBooks(storedBooks)
    setTransactions(storedTransactions)

    // Get current books borrowed by user
    const userTransactions = storedTransactions.filter(
      t => t.memberId === user.id && t.returnDate === null
    )
    setCurrentBooks(userTransactions.map(t => t.bookId))
  }, [user.id])

  const handleBorrowBook = () => {
    if (!selectedBook) {
      setMessage('Please select a book to borrow')
      return
    }

    const bookAlreadyBorrowed = currentBooks.includes(selectedBook)
    if (bookAlreadyBorrowed) {
      setMessage('You already have this book borrowed')
      return
    }

    try {
      borrowBook(selectedBook, user.id)
      setCurrentBooks([...currentBooks, selectedBook])
      setSelectedBook('')
      setMessage('✓ Book borrowed successfully! Due in 2 weeks.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error borrowing book')
    }
  }

  const availableBooks = books.filter(
    b =>
      b.availableCopies > 0 &&
      !currentBooks.includes(b.id) &&
      (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const myBooks = books.filter(b => currentBooks.includes(b.id))

  return (
    <div className="kiosk-mode">
      <div className="kiosk-navbar">
        <div className="kiosk-navbar-left">
          <BookOpen size={28} />
          <div>
            <h2>GS Busanza Library</h2>
            <p>Welcome, {user.name} ({user.class})</p>
          </div>
        </div>
        <div className="kiosk-navbar-right">
          <button onClick={onBackToMain} className="kiosk-icon-btn" title="Main Menu">
            <Home size={24} />
          </button>
          <button onClick={onLogout} className="kiosk-icon-btn danger" title="Logout">
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="kiosk-tabs">
        <button
          className={`kiosk-tab ${activeTab === 'borrow' ? 'active' : ''}`}
          onClick={() => setActiveTab('borrow')}
        >
          <Plus size={20} /> Borrow Books
        </button>
        <button
          className={`kiosk-tab ${activeTab === 'myBooks' ? 'active' : ''}`}
          onClick={() => setActiveTab('myBooks')}
        >
          <BookOpen size={20} /> My Books ({currentBooks.length})
        </button>
        <button
          className={`kiosk-tab ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('inbox')}
        >
          <MessageSquare size={20} /> Contact Librarian
        </button>
        <button
          className={`kiosk-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <Users size={20} /> Community Chat
        </button>
      </div>

      <div className="kiosk-content">
        {message && (
          <div className={`kiosk-message ${message.startsWith('✓') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {activeTab === 'borrow' && (
          <div className="kiosk-section">
            <h3>📚 Borrow a Book</h3>

            <div className="kiosk-search">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="kiosk-search-input"
              />
            </div>

            <div className="kiosk-book-grid">
              {availableBooks.map(book => (
                <div
                  key={book.id}
                  className={`kiosk-book-card ${selectedBook === book.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBook(book.id)}
                >
                  <div className="book-icon">📖</div>
                  <h4>{book.title}</h4>
                  <p className="author">{book.author}</p>
                  <p className="category">{book.category}</p>
                  <p className="copies">Available: {book.availableCopies}/{book.copies}</p>
                </div>
              ))}
            </div>

            {availableBooks.length === 0 && (
              <div className="empty-state">
                <p>No books available matching your search</p>
              </div>
            )}

            {selectedBook && (
              <div className="kiosk-action">
                <button
                  onClick={handleBorrowBook}
                  className="kiosk-btn kiosk-btn-primary"
                >
                  ✓ Confirm Borrow
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'myBooks' && (
          <div className="kiosk-section">
            <h3>📖 Your Current Books ({myBooks.length})</h3>

            {myBooks.length === 0 ? (
              <div className="empty-state">
                <p>You haven't borrowed any books yet</p>
                <button
                  onClick={() => setActiveTab('borrow')}
                  className="kiosk-btn kiosk-btn-primary"
                >
                  Browse Books
                </button>
              </div>
            ) : (
              <div className="kiosk-books-list">
                {myBooks.map(book => {
                  const transaction = transactions.find(
                    t => t.bookId === book.id && t.memberId === user.id && t.returnDate === null
                  )
                  const daysLeft = transaction
                    ? Math.ceil(
                        (new Date(transaction.dueDate).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                      )
                    : 0

                  return (
                    <div key={book.id} className={`book-info ${daysLeft < 3 ? 'urgent' : ''}`}>
                      <div className="book-details">
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                      </div>
                      <div className={`days-left ${daysLeft < 0 ? 'overdue' : ''}`}>
                        {daysLeft < 0
                          ? `${Math.abs(daysLeft)} days overdue`
                          : `${daysLeft} days left`}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inbox' && <InboxSection user={user} />}

        {activeTab === 'chat' && <PeerChat user={user} />}
      </div>

      <div className="kiosk-footer-bar">
        <p>© GS Busanza School Library | Press BRK or touch Main Menu to exit</p>
      </div>
    </div>
  )
}
