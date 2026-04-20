'use client'

import { useState, useEffect } from 'react'
import { Download, Filter, BarChart3, AlertCircle, CheckCircle } from 'lucide-react'
import { getUsers, getBooks, getTransactions } from '@/lib/database'

interface BorrowingReportProps {
  onBack: () => void
}

export default function BorrowingReport({ onBack }: BorrowingReportProps) {
  const [view, setView] = useState<'active' | 'overdue' | 'returned' | 'all'>('active')
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [stats, setStats] = useState({
    totalBorrowed: 0,
    activeBorrowed: 0,
    overdue: 0,
    returned: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allTransactions = getTransactions()
    const allUsers = getUsers()
    const allBooks = getBooks()

    setUsers(allUsers)
    setBooks(allBooks)
    setTransactions(allTransactions)

    const now = new Date()
    let active = 0
    let overdue = 0
    let returned = 0

    allTransactions.forEach(t => {
      if (t.returnDate) {
        returned++
      } else if (new Date(t.dueDate) < now) {
        overdue++
      } else {
        active++
      }
    })

    setStats({
      totalBorrowed: allTransactions.length,
      activeBorrowed: active,
      overdue: overdue,
      returned: returned,
    })

    filterTransactions(allTransactions, 'active', '')
  }

  const filterTransactions = (trans: any[], viewType: string, userSearch: string) => {
    const now = new Date()
    let filtered = trans

    if (viewType === 'active') {
      filtered = trans.filter(t => !t.returnDate && new Date(t.dueDate) >= now)
    } else if (viewType === 'overdue') {
      filtered = trans.filter(t => !t.returnDate && new Date(t.dueDate) < now)
    } else if (viewType === 'returned') {
      filtered = trans.filter(t => t.returnDate)
    }

    if (userSearch) {
      filtered = filtered.filter(t => {
        const user = users.find(u => u.id === t.memberId)
        return user?.name.toLowerCase().includes(userSearch.toLowerCase())
      })
    }

    setFilteredData(filtered)
  }

  const handleFilterChange = (viewType: string) => {
    setView(viewType as any)
    filterTransactions(transactions, viewType, searchUser)
  }

  const handleSearch = (query: string) => {
    setSearchUser(query)
    filterTransactions(transactions, view, query)
  }

  const downloadReport = () => {
    let csvContent = 'User Name,Email,Book Title,Author,Borrowed Date,Due Date,Returned Date,Status\n'

    filteredData.forEach(t => {
      const user = users.find(u => u.id === t.memberId)
      const book = books.find(b => b.id === t.bookId)
      const status = t.returnDate ? 'Returned' : new Date(t.dueDate) < new Date() ? 'Overdue' : 'Active'

      csvContent += `${user?.name || 'N/A'},${user?.email || 'N/A'},${book?.title || 'N/A'},${book?.author || 'N/A'},${new Date(t.borrowDate).toLocaleDateString()},${new Date(t.dueDate).toLocaleDateString()},${t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '-'},${status}\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `borrowing-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="report-container">
      <div className="report-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>📊 Borrowing Report</h1>
        <button onClick={downloadReport} className="download-btn">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Borrowed</h3>
          <p className="stat-number">{stats.totalBorrowed}</p>
        </div>
        <div className="stat-card active">
          <h3>Currently Active</h3>
          <p className="stat-number">{stats.activeBorrowed}</p>
        </div>
        <div className="stat-card overdue">
          <h3>Overdue Books</h3>
          <p className="stat-number">{stats.overdue}</p>
        </div>
        <div className="stat-card returned">
          <h3>Returned</h3>
          <p className="stat-number">{stats.returned}</p>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-tabs">
          <button
            className={`tab ${view === 'active' ? 'active' : ''}`}
            onClick={() => handleFilterChange('active')}
          >
            Active ({stats.activeBorrowed})
          </button>
          <button
            className={`tab ${view === 'overdue' ? 'active' : ''}`}
            onClick={() => handleFilterChange('overdue')}
          >
            Overdue ({stats.overdue})
          </button>
          <button
            className={`tab ${view === 'returned' ? 'active' : ''}`}
            onClick={() => handleFilterChange('returned')}
          >
            Returned ({stats.returned})
          </button>
          <button
            className={`tab ${view === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All ({stats.totalBorrowed})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by user name..."
          value={searchUser}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="report-table">
        <div className="table-header">
          <div className="col-user">User</div>
          <div className="col-book">Book</div>
          <div className="col-author">Author</div>
          <div className="col-dates">Borrowed</div>
          <div className="col-dates">Due</div>
          <div className="col-dates">Returned</div>
          <div className="col-status">Status</div>
        </div>

        {filteredData.length === 0 ? (
          <div className="no-data">No records found</div>
        ) : (
          filteredData.map((trans) => {
            const user = users.find(u => u.id === trans.memberId)
            const book = books.find(b => b.id === trans.bookId)
            const isOverdue = !trans.returnDate && new Date(trans.dueDate) < new Date()
            const statusClass = trans.returnDate ? 'returned' : isOverdue ? 'overdue' : 'active'
            const status = trans.returnDate ? '✓ Returned' : isOverdue ? '⚠️ Overdue' : '📚 Active'

            return (
              <div key={trans.id} className="table-row">
                <div className="col-user">
                  <strong>{user?.name}</strong>
                  <small>{user?.email}</small>
                </div>
                <div className="col-book">{book?.title}</div>
                <div className="col-author">{book?.author}</div>
                <div className="col-dates">{new Date(trans.borrowDate).toLocaleDateString()}</div>
                <div className="col-dates">{new Date(trans.dueDate).toLocaleDateString()}</div>
                <div className="col-dates">{trans.returnDate ? new Date(trans.returnDate).toLocaleDateString() : '-'}</div>
                <div className={`col-status ${statusClass}`}>{status}</div>
              </div>
            )
          })
        )}
      </div>

      <style jsx>{`
        .report-container {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 20px;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .report-header h1 {
          flex: 1;
          text-align: center;
          margin: 0;
          color: #333;
          font-size: 24px;
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

        .download-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #667eea;
        }

        .stat-card.active {
          border-left-color: #2196f3;
        }

        .stat-card.overdue {
          border-left-color: #f44336;
        }

        .stat-card.returned {
          border-left-color: #4caf50;
        }

        .stat-card h3 {
          margin: 0 0 10px;
          color: #666;
          font-size: 14px;
          font-weight: 600;
        }

        .stat-number {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #667eea;
        }

        .filter-section {
          background: white;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          border-bottom: 2px solid #eee;
        }

        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .search-input {
          width: 100%;
          padding: 10px;
          border: 2px solid #eee;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .report-table {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 1.5fr 2fr 1.5fr 1fr 1fr 1fr 1.2fr;
          gap: 15px;
          padding: 15px;
          border-bottom: 1px solid #eee;
          align-items: center;
        }

        .table-header {
          background: #f8f9fa;
          font-weight: 700;
          color: #333;
          border-bottom: 2px solid #ddd;
        }

        .table-row {
          transition: background 0.3s;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .col-user strong {
          display: block;
          color: #333;
          font-size: 14px;
        }

        .col-user small {
          display: block;
          color: #888;
          font-size: 12px;
          margin-top: 3px;
        }

        .col-book, .col-author, .col-dates {
          color: #666;
          font-size: 14px;
        }

        .col-status {
          text-align: center;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
        }

        .col-status.active {
          background: #e3f2fd;
          color: #1565c0;
        }

        .col-status.overdue {
          background: #ffebee;
          color: #d32f2f;
        }

        .col-status.returned {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .no-data {
          text-align: center;
          padding: 40px;
          color: #888;
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}
