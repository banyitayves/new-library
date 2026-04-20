'use client'

import { useState } from 'react'
import { BookPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { addBook, getBooks } from '@/lib/database'

interface RegisterBooksProps {
  onBack: () => void
  onSuccess?: () => void
}

export default function RegisterBooks({ onBack, onSuccess }: RegisterBooksProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'General',
    copies: '1',
    tags: '',
    summary: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [booksList, setBooksList] = useState<any[]>([])

  const categories = [
    'General',
    'Literature',
    'Science',
    'History',
    'Technology',
    'Mathematics',
    'Art',
    'Philosophy',
    'Biography',
    'Fiction',
    'Dystopian',
    'Fantasy',
    'Romance',
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (!formData.title.trim() || !formData.author.trim()) {
        setMessage({ type: 'error', text: 'Title and Author are required' })
        setLoading(false)
        return
      }

      const newBook = addBook({
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn || `ISBN-${Math.random().toString(36).substr(2, 10)}`,
        category: formData.category,
        copies: parseInt(formData.copies) || 1,
        availableCopies: parseInt(formData.copies) || 1,
        addedDate: new Date().toISOString(),
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        summary: formData.summary,
      })

      setMessage({ type: 'success', text: `Book "${newBook.title}" registered successfully!` })
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: 'General',
        copies: '1',
        tags: '',
        summary: '',
      })

      // Update books list
      setBooksList(getBooks())
      
      onSuccess?.()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>📚 Register New Book</h1>
      </div>

      <div className="register-content">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label>Book Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="ISBN (optional)"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Copies</label>
                <input
                  type="number"
                  name="copies"
                  value={formData.copies}
                  onChange={handleChange}
                  min="1"
                  max="999"
                />
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., classic, fiction, 20th-century"
                />
              </div>
            </div>

            <div className="form-group full">
              <label>Summary</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Book summary or description"
                rows={4}
              />
            </div>

            {message && (
              <div className={`message ${message.type}`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              <BookPlus size={18} />
              {loading ? 'Registering...' : 'Register Book'}
            </button>
          </form>
        </div>

        {booksList.length > 0 && (
          <div className="recent-books">
            <h2>Recently Added Books</h2>
            <div className="books-list">
              {booksList.slice(-5).map(book => (
                <div key={book.id} className="book-item">
                  <div className="book-details">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                    <p className="category">{book.category}</p>
                  </div>
                  <div className="book-stats">
                    <span className="copies">{book.copies} copies</span>
                    <span className="date">{new Date(book.addedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 20px;
        }

        .register-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .back-btn {
          background: #f0f0f0;
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

        .register-header h1 {
          flex: 1;
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .register-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .register-content {
            grid-template-columns: 1fr;
          }
        }

        .form-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full {
          grid-column: 1 / -1;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 12px;
          border: 2px solid #eee;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .message {
          padding: 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border-left: 3px solid #4caf50;
        }

        .message.error {
          background: #ffebee;
          color: #d32f2f;
          border-left: 3px solid #f44336;
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recent-books {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .recent-books h2 {
          margin: 0 0 20px;
          color: #333;
          font-size: 20px;
        }

        .books-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .book-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 3px solid #667eea;
          transition: all 0.3s;
        }

        .book-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .book-details h4 {
          margin: 0 0 5px;
          color: #333;
          font-size: 14px;
        }

        .book-details p {
          margin: 3px 0;
          color: #666;
          font-size: 13px;
        }

        .book-details .category {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          display: inline-block;
          font-size: 12px;
        }

        .book-stats {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .book-stats span {
          font-size: 12px;
          color: #666;
          background: white;
          padding: 6px 10px;
          border-radius: 4px;
        }

        .book-stats .copies {
          color: #667eea;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
