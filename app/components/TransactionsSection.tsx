'use client'

import { useState, useEffect } from 'react'
import { Plus, CheckCircle, XCircle } from 'lucide-react'
import { getBooks, getMembers, getTransactions, borrowBook, returnBook } from '@/lib/database'
import type { Transaction, Book, Member } from '@/lib/database'

export default function TransactionsSection() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [books, setBooks] = useState<Book[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    bookId: '',
    memberId: '',
  })

  useEffect(() => {
    setBooks(getBooks())
    setMembers(getMembers())
    setTransactions(getTransactions())
  }, [])

  const handleBorrowBook = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const transaction = borrowBook(formData.bookId, formData.memberId)
      setTransactions([...transactions, transaction])
      setFormData({ bookId: '', memberId: '' })
      setShowForm(false)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error borrowing book')
    }
  }

  const handleReturnBook = (transactionId: string) => {
    try {
      const transaction = returnBook(transactionId)
      setTransactions(
        transactions.map(t =>
          t.id === transactionId ? transaction : t
        )
      )
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error returning book')
    }
  }

  const activeTransactions = transactions.filter(t => t.returnDate === null)
  const returnedTransactions = transactions.filter(t => t.returnDate !== null)

  const getBookTitle = (bookId: string) =>
    books.find(b => b.id === bookId)?.title || 'Unknown'

  const getMemberName = (memberId: string) =>
    members.find(m => m.id === memberId)?.name || 'Unknown'

  return (
    <div className="section">
      <div className="section-header">
        <h2>Transactions Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          <Plus size={18} /> New Transaction
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleBorrowBook} className="form-card">
          <div className="form-row">
            <div className="form-group">
              <label>Select Member</label>
              <select
                value={formData.memberId}
                onChange={(e) =>
                  setFormData({ ...formData, memberId: e.target.value })
                }
                required
              >
                <option value="">Choose a member...</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Select Book</label>
              <select
                value={formData.bookId}
                onChange={(e) =>
                  setFormData({ ...formData, bookId: e.target.value })
                }
                required
              >
                <option value="">Choose a book...</option>
                {books.filter(b => b.availableCopies > 0).map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Borrow Book
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

      <div className="tabs">
        <h3>Active Loans ({activeTransactions.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Days Left</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTransactions.map(tx => {
                const daysLeft = Math.ceil(
                  (new Date(tx.dueDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
                )
                return (
                  <tr key={tx.id} className={daysLeft < 0 ? 'overdue' : ''}>
                    <td>{getMemberName(tx.memberId)}</td>
                    <td>{getBookTitle(tx.bookId)}</td>
                    <td>{new Date(tx.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(tx.dueDate).toLocaleDateString()}</td>
                    <td className={daysLeft < 0 ? 'text-danger' : ''}>
                      {daysLeft < 0 ? `${Math.abs(daysLeft)} OVERDUE` : daysLeft}
                    </td>
                    <td>
                      <button
                        onClick={() => handleReturnBook(tx.id)}
                        className="btn-icon btn-success"
                      >
                        <CheckCircle size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {activeTransactions.length === 0 && (
            <p className="empty-state">No active loans</p>
          )}
        </div>
      </div>

      <div className="tabs">
        <h3>Returned Books ({returnedTransactions.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {returnedTransactions.map(tx => (
                <tr key={tx.id}>
                  <td>{getMemberName(tx.memberId)}</td>
                  <td>{getBookTitle(tx.bookId)}</td>
                  <td>{new Date(tx.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(tx.returnDate!).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {returnedTransactions.length === 0 && (
            <p className="empty-state">No returned books</p>
          )}
        </div>
      </div>
    </div>
  )
}
