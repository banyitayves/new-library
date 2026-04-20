'use client'

import { useState, useEffect } from 'react'
import { Users, Book, RotateCcw, LogOut, Search } from 'lucide-react'
import { getUsers, getTransactions, getBooks, User, Transaction } from '@/lib/database'

interface DeputyPanelProps {
  onLogout: () => void
}

export default function DeputyPanel({ onLogout }: DeputyPanelProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'history'>('students')
  const [students, setStudents] = useState<User[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userBooks, setUserBooks] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const users = getUsers()
    const trans = getTransactions()
    const allBooks = getBooks()

    const approvedStudents = users.filter(u => u.role === 'student' && u.status === 'approved')
    const approvedTeachers = users.filter(u => u.role === 'teacher' && u.status === 'approved')

    setStudents(approvedStudents)
    setTeachers(approvedTeachers)
    setTransactions(trans)
    setBooks(allBooks)
  }

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    const userTrans = transactions.filter(t => t.memberId === user.id)
    const userBookData = userTrans.map(t => {
      const book = books.find(b => b.id === t.bookId)
      return {
        ...t,
        bookTitle: book?.title,
        bookAuthor: book?.author,
        isOverdue: t.returnDate === null && new Date(t.dueDate) < new Date(),
      }
    })
    setUserBooks(userBookData)
  }

  const filteredStudents = students.filter(
    s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.class?.includes(searchTerm.toUpperCase())
  )

  const filteredTeachers = teachers.filter(
    t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         t.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="deputy-container">
      <div className="deputy-header">
        <div>
          <h1>📚 Deputy Head Teacher Dashboard</h1>
          <p>Monitor Students, Teachers & Book History</p>
        </div>
        <button onClick={onLogout} className="btn btn-logout">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="deputy-tabs">
        <button
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('students')
            setSelectedUser(null)
            setSearchTerm('')
          }}
        >
          <Users size={20} />
          Students
        </button>
        <button
          className={`tab-button ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('teachers')
            setSelectedUser(null)
            setSearchTerm('')
          }}
        >
          <Users size={20} />
          Teachers
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('history')
            setSelectedUser(null)
            setSearchTerm('')
          }}
        >
          <Book size={20} />
          Book History
        </button>
      </div>

      {!selectedUser ? (
        <div className="deputy-content">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder={
                activeTab === 'students' ? 'Search students by name, email, or class...' :
                activeTab === 'teachers' ? 'Search teachers by name or email...' :
                'Search by user name or email...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {activeTab === 'students' && (
            <div className="user-list">
              <h2>Approved Students ({filteredStudents.length})</h2>
              {filteredStudents.length === 0 ? (
                <p className="empty-state">No students found</p>
              ) : (
                filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className="user-card"
                    onClick={() => handleSelectUser(student)}
                  >
                    <div className="user-info">
                      <h3>{student.name}</h3>
                      <p className="class-badge">Class: {student.class}</p>
                      <p className="email">{student.email}</p>
                    </div>
                    <div className="user-stats">
                      <div className="stat">
                        <span className="stat-label">Books Borrowed</span>
                        <span className="stat-value">
                          {transactions.filter(t => t.memberId === student.id && !t.returnDate).length}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total Borrowed</span>
                        <span className="stat-value">
                          {transactions.filter(t => t.memberId === student.id).length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="user-list">
              <h2>Approved Teachers ({filteredTeachers.length})</h2>
              {filteredTeachers.length === 0 ? (
                <p className="empty-state">No teachers found</p>
              ) : (
                filteredTeachers.map(teacher => (
                  <div
                    key={teacher.id}
                    className="user-card"
                    onClick={() => handleSelectUser(teacher)}
                  >
                    <div className="user-info">
                      <h3>{teacher.name}</h3>
                      <p className="phone-badge">📞 {teacher.phone}</p>
                      <p className="email">{teacher.email}</p>
                    </div>
                    <div className="user-stats">
                      <div className="stat">
                        <span className="stat-label">Books Borrowed</span>
                        <span className="stat-value">
                          {transactions.filter(t => t.memberId === teacher.id && !t.returnDate).length}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total Borrowed</span>
                        <span className="stat-value">
                          {transactions.filter(t => t.memberId === teacher.id).length}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="history-list">
              <h2>Complete Borrowing History</h2>
              {transactions.length === 0 ? (
                <p className="empty-state">No borrowing history</p>
              ) : (
                <div className="history-table">
                  <div className="table-header">
                    <div>User</div>
                    <div>Book</div>
                    <div>Borrowed</div>
                    <div>Due</div>
                    <div>Returned</div>
                    <div>Status</div>
                  </div>
                  {transactions.map(trans => {
                    const user = [...students, ...teachers].find(u => u.id === trans.memberId)
                    const book = books.find(b => b.id === trans.bookId)
                    const isOverdue = !trans.returnDate && new Date(trans.dueDate) < new Date()
                    
                    return (
                      <div key={trans.id} className="table-row">
                        <div><strong>{user?.name}</strong></div>
                        <div>{book?.title}</div>
                        <div>{new Date(trans.borrowDate).toLocaleDateString()}</div>
                        <div>{new Date(trans.dueDate).toLocaleDateString()}</div>
                        <div>{trans.returnDate ? new Date(trans.returnDate).toLocaleDateString() : '-'}</div>
                        <div className={`status-badge ${isOverdue ? 'overdue' : trans.returnDate ? 'returned' : 'active'}`}>
                          {isOverdue ? '⚠️ Overdue' : trans.returnDate ? '✓ Returned' : '📚 Active'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="deputy-detail">
          <button className="back-button" onClick={() => setSelectedUser(null)}>
            ← Back to List
          </button>
          
          <div className="detail-header">
            <div>
              <h2>{selectedUser.name}</h2>
              <p className="role-badge">{selectedUser.role === 'student' ? '👨‍🎓' : '👨‍🏫'} {selectedUser.role}</p>
              {selectedUser.class && <p className="class-badge">Class: {selectedUser.class}</p>}
              {selectedUser.phone && <p className="phone-badge">📞 {selectedUser.phone}</p>}
            </div>
            <div className="detail-info">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Joined:</strong> {new Date(selectedUser.joinDate).toLocaleDateString()}</p>
              <p><strong>Status:</strong> <span className="status-badge approved">{selectedUser.status}</span></p>
            </div>
          </div>

          <div className="book-history">
            <h3>📚 Book Borrowing History</h3>
            {userBooks.length === 0 ? (
              <p className="empty-state">No books borrowed yet</p>
            ) : (
              <div className="history-list">
                {userBooks.map(record => (
                  <div key={record.id} className={`book-record ${record.isOverdue ? 'overdue' : record.returnDate ? 'returned' : 'active'}`}>
                    <div className="record-info">
                      <h4>{record.bookTitle}</h4>
                      <p className="author">{record.bookAuthor}</p>
                    </div>
                    <div className="record-dates">
                      <p><strong>Borrowed:</strong> {new Date(record.borrowDate).toLocaleDateString()}</p>
                      <p><strong>Due:</strong> {new Date(record.dueDate).toLocaleDateString()}</p>
                      {record.returnDate ? (
                        <p><strong>Returned:</strong> {new Date(record.returnDate).toLocaleDateString()}</p>
                      ) : (
                        <p><strong>Status:</strong> {record.isOverdue ? '⚠️ OVERDUE' : '📚 Currently Borrowed'}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .deputy-container {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 20px;
        }

        .deputy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .deputy-header h1 {
          font-size: 32px;
          margin: 0 0 5px;
        }

        .deputy-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .deputy-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 3px solid #ddd;
          background: white;
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .tab-button {
          flex: 1;
          padding: 15px;
          border: none;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 600;
          color: #666;
          transition: all 0.3s;
          border-bottom: 3px solid transparent;
        }

        .tab-button.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: #f8f9ff;
        }

        .tab-button:hover {
          background: #f8f9ff;
        }

        .deputy-content {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f5f7fa;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 25px;
          width: 100%;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 14px;
          outline: none;
        }

        .user-list h2 {
          color: #333;
          margin-bottom: 20px;
          font-size: 20px;
        }

        .user-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8f9fa;
          border: 2px solid #eee;
          border-radius: 8px;
          margin-bottom: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .user-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        .user-info h3 {
          margin: 0 0 8px;
          color: #333;
          font-size: 18px;
        }

        .user-info p {
          margin: 5px 0;
          color: #666;
          font-size: 13px;
        }

        .class-badge, .phone-badge {
          display: inline-block;
          background: #e8f4f8;
          color: #006b8f;
          padding: 4px 8px;
          border-radius: 4px;
          margin-right: 8px;
        }

        .email {
          color: #888;
          font-size: 12px;
        }

        .user-stats {
          display: flex;
          gap: 20px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .stat-label {
          color: #888;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #667eea;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #888;
          font-size: 16px;
        }

        .history-table {
          overflow-x: auto;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr;
          gap: 15px;
          padding: 15px;
          border-bottom: 1px solid #eee;
          align-items: center;
        }

        .table-header {
          background: #f8f9fa;
          font-weight: 700;
          color: #666;
          border-bottom: 2px solid #ddd;
        }

        .table-row:hover {
          background: #f8f9fa;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }

        .status-badge.overdue {
          background: #ffe8e8;
          color: #d32f2f;
        }

        .status-badge.returned {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.active {
          background: #e3f2fd;
          color: #1565c0;
        }

        .status-badge.approved {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .deputy-detail {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .back-button {
          background: #f0f0f0;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          color: #333;
          margin-bottom: 20px;
          transition: all 0.3s;
        }

        .back-button:hover {
          background: #e0e0e0;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          margin-bottom: 30px;
          border-left: 4px solid #667eea;
        }

        .detail-header h2 {
          margin: 0 0 10px;
          color: #333;
        }

        .role-badge {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin: 0;
        }

        .detail-info {
          text-align: right;
        }

        .detail-info p {
          margin: 8px 0;
          color: #666;
          font-size: 14px;
        }

        .detail-info strong {
          color: #333;
        }

        .book-history {
          margin-top: 30px;
        }

        .book-history h3 {
          color: #333;
          margin-bottom: 20px;
          font-size: 18px;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .book-record {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #ddd;
          background: #f8f9fa;
        }

        .book-record.active {
          border-left-color: #2196f3;
          background: #e3f2fd;
        }

        .book-record.returned {
          border-left-color: #4caf50;
          background: #e8f5e9;
        }

        .book-record.overdue {
          border-left-color: #f44336;
          background: #ffebee;
        }

        .record-info h4 {
          margin: 0 0 5px;
          color: #333;
          font-size: 16px;
        }

        .record-info .author {
          margin: 0;
          color: #888;
          font-size: 13px;
        }

        .record-dates {
          text-align: right;
        }

        .record-dates p {
          margin: 5px 0;
          color: #666;
          font-size: 13px;
        }

        .record-dates strong {
          color: #333;
        }
      `}</style>
    </div>
  )
}
