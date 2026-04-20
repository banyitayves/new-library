'use client'

import { useState, useEffect } from 'react'
import {
  LogOut,
  BookOpen,
  Sparkles,
  MessageCircle,
  BarChart3,
  Heart,
  Clock,
  Search,
} from 'lucide-react'
import {
  getBooks,
  getTransactions,
  borrowBook,
  returnBook,
  getUserById,
} from '@/lib/database'

interface StudentDashboardProps {
  user: any
  onLogout: () => void
  onNavigate: (view: string) => void
}

export default function StudentDashboard({
  user,
  onLogout,
  onNavigate,
}: StudentDashboardProps) {
  const [view, setView] = useState<'overview' | 'books' | 'myborrow'>('overview')
  const [books, setBooks] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([])
  const [likedBooks, setLikedBooks] = useState<string[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allBooks = getBooks()
    setBooks(allBooks)

    const userTransactions = getTransactions().filter(
      t => t.memberId === user.id && !t.returnDate
    )
    setTransactions(userTransactions)

    const borrowed = userTransactions
      .map(t => {
        const book = allBooks.find(b => b.id === t.bookId)
        return { ...book, transactionId: t.id }
      })
      .filter(Boolean)

    setBorrowedBooks(borrowed)
  }

  const handleBorrowBook = (bookId: string) => {
    try {
      borrowBook(bookId, user.id)
      loadData()
      alert('Book borrowed successfully!')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleReturnBook = (transactionId: string) => {
    try {
      returnBook(transactionId)
      loadData()
      alert('Book returned successfully!')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const toggleLike = (bookId: string) => {
    setLikedBooks(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    )
  }

  const canBorrow = borrowedBooks.length < user.maxBooks
  const overduedBooks = borrowedBooks.filter(
    b => new Date(b.dueDate) < new Date()
  )

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="header-info">
          <h1>Welcome, {user.name}! 👋</h1>
          <p>
            {user.role === 'student'
              ? `Class ${user.class} | Student`
              : 'Teacher'}{' '}
            • {borrowedBooks.length}/{user.maxBooks} books borrowed
          </p>
        </div>
        <button onClick={onLogout} className="logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="nav-tabs">
          <button
            onClick={() => setView('overview')}
            className={`nav-btn ${view === 'overview' ? 'active' : ''}`}
          >
            <BarChart3 size={18} />
            Overview
          </button>
          <button
            onClick={() => setView('books')}
            className={`nav-btn ${view === 'books' ? 'active' : ''}`}
          >
            <BookOpen size={18} />
            Browse Books
          </button>
          <button
            onClick={() => setView('myborrow')}
            className={`nav-btn ${view === 'myborrow' ? 'active' : ''}`}
          >
            <Clock size={18} />
            My Books ({borrowedBooks.length})
          </button>
        </div>

        <div className="feature-buttons">
          <button
            onClick={() => onNavigate('search-books')}
            className="feature-btn"
          >
            <Search size={20} />
            <span>Search Books</span>
          </button>
          <button
            onClick={() => onNavigate('ai-recommendations')}
            className="feature-btn"
          >
            <Sparkles size={20} />
            <span>AI Recommendations</span>
          </button>
          <button
            onClick={() => onNavigate('qa-system')}
            className="feature-btn"
          >
            <MessageCircle size={20} />
            <span>Ask Questions</span>
          </button>
        </div>

        {view === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <BookOpen size={24} />
                <h3>{borrowedBooks.length}</h3>
                <p>Books Borrowed</p>
              </div>
              <div className="stat-card">
                <Clock size={24} />
                <h3>{overduedBooks.length}</h3>
                <p>Overdue Books</p>
              </div>
              <div className="stat-card">
                <Heart size={24} />
                <h3>{likedBooks.length}</h3>
                <p>Books Liked</p>
              </div>
              <div className="stat-card">
                <BookOpen size={24} />
                <h3>{books.length}</h3>
                <p>Total Available</p>
              </div>
            </div>

            {borrowedBooks.length > 0 && (
              <div className="current-books">
                <h2>Your Current Books</h2>
                <div className="books-list">
                  {borrowedBooks.map(book => {
                    const isOverdue = new Date(book.dueDate) < new Date()
                    return (
                      <div
                        key={book.transactionId}
                        className={`book-row ${isOverdue ? 'overdue' : ''}`}
                      >
                        <div className="book-info">
                          <h4>{book.title}</h4>
                          <p className="author">by {book.author}</p>
                          <p className="due-date">
                            Due: {new Date(book.dueDate).toLocaleDateString()}
                            {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => handleReturnBook(book.transactionId)}
                          className="btn btn-secondary"
                        >
                          Return
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'books' && (
          <div className="books-section">
            <h2>Available Books to Borrow</h2>
            {!canBorrow && (
              <div className="warning-box">
                You've reached your maximum borrowing limit ({user.maxBooks} books).
                Please return some books to borrow more.
              </div>
            )}
            <div className="books-grid">
              {books.map(book => (
                <div key={book.id} className="book-card">
                  <div className="book-cover">
                    <BookOpen size={40} />
                  </div>
                  <h3>{book.title}</h3>
                  <p className="author">by {book.author}</p>
                  <p className="category">{book.category}</p>
                  <div className="book-footer">
                    <span className="availability">
                      {book.availableCopies > 0
                        ? `${book.availableCopies} available`
                        : 'Not available'}
                    </span>
                    <div className="actions">
                      <button
                        onClick={() => toggleLike(book.id)}
                        className={`like-btn ${likedBooks.includes(book.id) ? 'liked' : ''}`}
                      >
                        <Heart
                          size={18}
                          fill={likedBooks.includes(book.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                      <button
                        onClick={() => handleBorrowBook(book.id)}
                        className="borrow-btn"
                        disabled={!canBorrow || book.availableCopies <= 0}
                      >
                        Borrow
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'myborrow' && (
          <div className="myborrow-section">
            <h2>My Borrowed Books</h2>
            {borrowedBooks.length > 0 ? (
              <div className="books-list">
                {borrowedBooks.map(book => {
                  const isOverdue = new Date(book.dueDate) < new Date()
                  return (
                    <div
                      key={book.transactionId}
                      className={`book-row ${isOverdue ? 'overdue' : ''}`}
                    >
                      <div className="book-info">
                        <h4>{book.title}</h4>
                        <p className="author">by {book.author}</p>
                        <p className="category">{book.category}</p>
                        <p className="due-date">
                          Due: {new Date(book.dueDate).toLocaleDateString()}
                          {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => handleReturnBook(book.transactionId)}
                        className="btn btn-primary"
                      >
                        Return Book
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="empty-state">
                <BookOpen size={48} />
                <h3>No books borrowed yet</h3>
                <button
                  onClick={() => setView('books')}
                  className="btn btn-primary"
                >
                  Browse Books
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .student-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .dashboard-header {
          max-width: 1200px;
          margin: 0 auto 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
        }

        .header-info h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .header-info p {
          margin: 0;
          opacity: 0.9;
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .nav-tabs {
          display: flex;
          border-bottom: 2px solid #e0e0e0;
          background: #f9f9f9;
        }

        .nav-btn {
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

        .nav-btn.active {
          color: #667eea;
          border-bottom: 3px solid #667eea;
          margin-bottom: -2px;
        }

        .nav-btn:hover {
          color: #667eea;
        }

        .feature-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          padding: 20px 30px;
          background: #f0f5ff;
          border-bottom: 2px solid #e0e0e0;
        }

        .feature-btn {
          background: white;
          border: 2px solid #667eea;
          color: #667eea;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
        }

        .feature-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        .overview-section,
        .books-section,
        .myborrow-section {
          padding: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .stat-card svg {
          margin-bottom: 10px;
        }

        .stat-card h3 {
          margin: 10px 0;
          font-size: 24px;
        }

        .stat-card p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
        }

        .current-books,
        .myborrow-section {
          margin-top: 30px;
        }

        .current-books h2,
        .books-section h2,
        .myborrow-section h2 {
          margin: 0 0 20px;
          color: #333;
          font-size: 24px;
        }

        .warning-box {
          background: #fff3cd;
          border-left: 4px solid #ff9800;
          padding: 15px;
          border-radius: 6px;
          margin-bottom: 20px;
          color: #856404;
        }

        .books-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .book-row {
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s;
        }

        .book-row:hover {
          border-color: #667eea;
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
        }

        .book-row.overdue {
          background: #ffebee;
          border-color: #e74c3c;
        }

        .book-info h4 {
          margin: 0 0 8px;
          color: #333;
        }

        .author {
          color: #666;
          font-size: 13px;
          margin: 0 0 4px;
        }

        .category {
          color: #999;
          font-size: 12px;
          margin: 0 0 8px;
        }

        .due-date {
          margin: 0;
          font-size: 13px;
          color: #667eea;
          font-weight: 600;
        }

        .overdue-badge {
          background: #e74c3c;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          margin-left: 8px;
          font-weight: bold;
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
        }

        .book-card:hover {
          border-color: #667eea;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
          transform: translateY(-5px);
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

        .book-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #e0e0e0;
        }

        .availability {
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .like-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #999;
          transition: all 0.3s;
          flex: none;
        }

        .like-btn:hover,
        .like-btn.liked {
          color: #e74c3c;
          transform: scale(1.2);
        }

        .borrow-btn {
          flex: 1;
          background: #667eea;
          color: white;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          transition: all 0.3s;
        }

        .borrow-btn:hover:not(:disabled) {
          background: #764ba2;
        }

        .borrow-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover {
          background: #764ba2;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-state svg {
          opacity: 0.3;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          margin: 0 0 20px;
          color: #666;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}
