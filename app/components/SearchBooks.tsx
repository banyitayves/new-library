'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Star, TrendingUp } from 'lucide-react'
import { getBooks, getTransactions } from '@/lib/database'
import { searchBooks, getUserBadges, checkReadingBadges } from '@/lib/features'

interface SearchBooksProps {
  userId: string
  onBack: () => void
}

export default function SearchBooks({ userId, onBack }: SearchBooksProps) {
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [userBadges, setUserBadges] = useState<any[]>([])
  const [filters, setFilters] = useState({
    category: '',
    author: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const allBooks = getBooks()
    setBooks(allBooks)
    setResults(allBooks)
    
    // Load user badges and check reading progress
    const badges = getUserBadges(userId)
    setUserBadges(badges)
    
    const transactions = getTransactions()
    const userBooks = transactions.filter(t => t.memberId === userId)
    checkReadingBadges(userId, userBooks.length)
  }, [userId])

  useEffect(() => {
    const filtered = searchBooks(query, books, {
      author: filters.author || undefined,
      category: filters.category || undefined,
    })
    setResults(filtered)
  }, [query, filters, books])

  const categories = [...new Set(books.map(b => b.category))]
  const authors = [...new Set(books.map(b => b.author))]

  return (
    <div className="search-books-container">
      <div className="search-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>🔍 Search Books & Resources</h1>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by title, author, or keyword..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle">
          <Filter size={18} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Author</label>
            <select
              value={filters.author}
              onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            >
              <option value="">All Authors</option>
              {authors.slice(0, 20).map(author => (
                <option key={author} value={author}>{author}</option>
              ))}
            </select>
          </div>

          <button onClick={() => setFilters({ category: '', author: '' })} className="reset-btn">
            Reset Filters
          </button>
        </div>
      )}

      <div className="badges-section">
        <div className="badge-header">
          <h3>📈 Your Reading Badges</h3>
        </div>
        <div className="badges-grid">
          {userBadges.length > 0 ? (
            userBadges.map(badge => (
              <div key={badge.id} className="badge-card">
                <span className="badge-icon">{badge.icon}</span>
                <h4>{badge.title}</h4>
                <p>{badge.description}</p>
              </div>
            ))
          ) : (
            <p className="no-badges">Borrow more books to earn badges! 🚀</p>
          )}
        </div>
      </div>

      <div className="results-section">
        <h2>Results ({results.length})</h2>
        {results.length === 0 ? (
          <div className="no-results">
            <TrendingUp size={40} />
            <p>No books found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="books-grid">
            {results.map(book => (
              <div key={book.id} className="book-card">
                <div className="book-header">
                  <h3>{book.title}</h3>
                  {book.availableCopies === 0 && <span className="unavailable">Not Available</span>}
                </div>
                <p className="author">{book.author}</p>
                <p className="category">{book.category}</p>
                <p className="summary">{book.summary || 'No description available'}</p>
                <div className="book-meta">
                  <span className="copies">Copies: {book.availableCopies}/{book.copies}</span>
                  {book.tags && <span className="tags">{book.tags.slice(0, 2).join(', ')}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .search-books-container {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 20px;
        }

        .search-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .back-btn {
          background: white;
          border: 2px solid #ddd;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .back-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .search-header h1 {
          color: #333;
          margin: 0;
          font-size: 28px;
        }

        .search-box {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
        }

        .filter-toggle {
          background: #667eea;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .filter-toggle:hover {
          background: #764ba2;
        }

        .filters-panel {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .filter-group select {
          padding: 8px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .reset-btn {
          background: #f0f0f0;
          border: 2px solid #ddd;
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          align-self: flex-end;
        }

        .reset-btn:hover {
          background: #e0e0e0;
        }

        .badges-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .badge-header h3 {
          margin: 0 0 15px;
          color: #333;
        }

        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
        }

        .badge-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .badge-icon {
          font-size: 32px;
          display: block;
          margin-bottom: 8px;
        }

        .badge-card h4 {
          margin: 0 0 5px;
          font-size: 14px;
        }

        .badge-card p {
          margin: 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .no-badges {
          text-align: center;
          color: #888;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin: 0;
        }

        .results-section h2 {
          color: #333;
          margin-bottom: 20px;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #888;
        }

        .no-results p {
          margin-top: 15px;
          font-size: 16px;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
        }

        .book-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          cursor: pointer;
        }

        .book-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .book-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .book-header h3 {
          margin: 0;
          color: #333;
          font-size: 16px;
          flex: 1;
        }

        .unavailable {
          background: #ffebee;
          color: #d32f2f;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .author {
          color: #666;
          font-size: 13px;
          margin: 5px 0;
        }

        .category {
          background: #f0f0f0;
          color: #666;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          display: inline-block;
          margin-bottom: 10px;
        }

        .summary {
          color: #888;
          font-size: 13px;
          margin: 10px 0;
          line-height: 1.4;
          max-height: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .book-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-top: 10px;
          border-top: 1px solid #eee;
          padding-top: 10px;
        }

        .copies {
          font-weight: 600;
        }

        .tags {
          color: #667eea;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
