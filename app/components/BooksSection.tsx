'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Search } from 'lucide-react'
import { getBooks, saveBooks, addBook } from '@/lib/database'
import type { Book } from '@/lib/database'

export default function BooksSection() {
  const [books, setBooks] = useState<Book[]>([])
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'General',
    copies: 1,
  })

  useEffect(() => {
    const storedBooks = getBooks()
    setBooks(storedBooks)
  }, [])

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()
    const newBook = addBook({
      ...formData,
      availableCopies: formData.copies,
      addedDate: new Date().toISOString(),
    })
    setBooks([...books, newBook])
    setFormData({ title: '', author: '', isbn: '', category: 'General', copies: 1 })
    setShowForm(false)

    // Send new book notification via Twilio
    const memberPhones = [''] // Get from members
    if (memberPhones.length > 0) {
      fetch('/api/twilio/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: memberPhones[0],
          message: `New book added: "${newBook.title}" by ${newBook.author}`,
          type: 'new-book',
        }),
      })
    }
  }

  const handleDeleteBook = (id: string) => {
    const updated = books.filter(b => b.id !== id)
    setBooks(updated)
    saveBooks(updated)
  }

  const filteredBooks = books.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="section">
      <div className="section-header">
        <h2>Books Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={18} /> Add Book
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddBook} className="form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>ISBN</label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>General</option>
                <option>Science</option>
                <option>History</option>
                <option>Fiction</option>
                <option>Reference</option>
              </select>
            </div>
            <div className="form-group">
              <label>Number of Copies</label>
              <input
                type="number"
                min="1"
                value={formData.copies}
                onChange={(e) =>
                  setFormData({ ...formData, copies: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search books by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Available</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.availableCopies}</td>
                <td>{book.copies}</td>
                <td>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="btn-icon btn-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredBooks.length === 0 && (
          <p className="empty-state">No books found</p>
        )}
      </div>
    </div>
  )
}
