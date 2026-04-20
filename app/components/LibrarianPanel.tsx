'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, CheckCircle, XCircle, Mail, Phone, Calendar, Upload, LogOut, BarChart3, MessageSquare, BookPlus, UserPlus, Settings } from 'lucide-react'
import ImportCSV from './ImportCSV'
import BorrowingReport from './BorrowingReport'
import SMSNotifications from './SMSNotifications'
import RegisterBooks from './RegisterBooks'
import RegisterMembers from './RegisterMembers'
import {
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration,
  getUsers,
} from '@/lib/database'

interface LibrarianPanelProps {
  onBack: () => void
  onNavigateToSettings?: () => void
}

export default function LibrarianPanel({ onBack, onNavigateToSettings }: LibrarianPanelProps) {
  const [view, setView] = useState<'pending' | 'approved' | 'all'>('pending')
  const [currentSection, setCurrentSection] = useState<'users' | 'reports' | 'sms' | 'books' | 'members'>('users')
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [approvedUsers, setApprovedUsers] = useState<any[]>([])
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showImportModal, setShowImportModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    setPendingUsers(getPendingRegistrations())
    const all = getUsers()
    setApprovedUsers(all.filter(u => u.status === 'approved'))
    setAllUsers(all.filter(u => u.role !== 'librarian'))
  }

  const handleApprove = (userId: string) => {
    approveRegistration(userId)
    loadUsers()
    setSelectedUser(null)
  }

  const handleReject = (userId: string) => {
    rejectRegistration(userId)
    loadUsers()
    setSelectedUser(null)
  }

  const getCurrentList = () => {
    switch (view) {
      case 'pending':
        return pendingUsers
      case 'approved':
        return approvedUsers
      default:
        return allUsers
    }
  }

  const currentList = getCurrentList()

  if (currentSection === 'reports') {
    return <BorrowingReport onBack={() => setCurrentSection('users')} />
  }

  if (currentSection === 'sms') {
    return <SMSNotifications onBack={() => setCurrentSection('users')} />
  }

  if (currentSection === 'books') {
    return <RegisterBooks onBack={() => setCurrentSection('users')} onSuccess={() => setCurrentSection('users')} />
  }

  if (currentSection === 'members') {
    return <RegisterMembers onBack={() => setCurrentSection('users')} onSuccess={() => {
      setCurrentSection('users')
      loadUsers()
    }} />
  }

  return (
    <div className="librarian-container">
      <div className="librarian-header">
        <div className="header-content">
          <Shield size={32} className="header-icon" />
          <div>
            <h1>Librarian Control Panel</h1>
            <p>Manage registrations, members & books</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => setCurrentSection('reports')} className="btn btn-primary">
            <BarChart3 size={18} /> Reports
          </button>
          <button onClick={() => setCurrentSection('sms')} className="btn btn-primary">
            <MessageSquare size={18} /> SMS Notify
          </button>
          <button onClick={() => setCurrentSection('books')} className="btn btn-primary">
            <BookPlus size={18} /> Add Book
          </button>
          <button onClick={() => setCurrentSection('members')} className="btn btn-primary">
            <UserPlus size={18} /> Add Member
          </button>
          <button onClick={() => setShowImportModal(true)} className="btn btn-primary">
            <Upload size={18} /> Import CSV
          </button>
          {onNavigateToSettings && (
            <button onClick={onNavigateToSettings} className="btn btn-primary">
              <Settings size={18} /> Settings
            </button>
          )}
          <button onClick={onBack} className="btn btn-secondary">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {showImportModal && (
        <ImportCSV
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false)
            loadUsers()
          }}
        />
      )}

      <div className="librarian-content">
        {!selectedUser ? (
          <div className="management-section">
            <div className="management-tabs">
              <button
                onClick={() => setView('pending')}
                className={`tab ${view === 'pending' ? 'active' : ''}`}
              >
                <Users size={18} />
                Pending Approvals
                {pendingUsers.length > 0 && (
                  <span className="badge">{pendingUsers.length}</span>
                )}
              </button>
              <button
                onClick={() => setView('approved')}
                className={`tab ${view === 'approved' ? 'active' : ''}`}
              >
                <CheckCircle size={18} />
                Approved Users ({approvedUsers.length})
              </button>
              <button
                onClick={() => setView('all')}
                className={`tab ${view === 'all' ? 'active' : ''}`}
              >
                <Users size={18} />
                All Users ({allUsers.length})
              </button>
            </div>

            <div className="users-list">
              {currentList.length > 0 ? (
                currentList.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`user-item ${user.status === 'pending' ? 'pending' : ''}`}
                  >
                    <div className="user-main">
                      <h4>{user.name}</h4>
                      <p className="user-email">{user.email}</p>
                      <div className="user-meta">
                        <span className="role">
                          {user.role === 'student'
                            ? '👨‍🎓 Student'
                            : '👨‍🏫 Teacher'}
                        </span>
                        {user.class && <span className="class">{user.class}</span>}
                        <span className="date">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="user-status">
                      {user.status === 'pending' ? (
                        <span className="status-badge pending">⏳ Pending</span>
                      ) : (
                        <span className="status-badge approved">✓ Approved</span>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>
                    {view === 'pending'
                      ? 'No pending registrations'
                      : view === 'approved'
                      ? 'No approved users'
                      : 'No users'}
                  </h3>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="user-detail-section">
            <button
              onClick={() => setSelectedUser(null)}
              className="back-btn"
            >
              ← Back to List
            </button>

            <div className="user-detail-card">
              <div className="detail-header">
                <h2>{selectedUser.name}</h2>
                <span
                  className={`status-badge ${
                    selectedUser.status === 'pending' ? 'pending' : 'approved'
                  }`}
                >
                  {selectedUser.status === 'pending' ? '⏳ Pending' : '✓ Approved'}
                </span>
              </div>

              <div className="detail-content">
                <div className="detail-group">
                  <h4>Basic Information</h4>
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{selectedUser.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <div className="value">
                      <Mail size={16} />
                      {selectedUser.email}
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="label">Phone:</span>
                    <div className="value">
                      <Phone size={16} />
                      {selectedUser.phone}
                    </div>
                  </div>
                </div>

                <div className="detail-group">
                  <h4>Account Details</h4>
                  <div className="detail-row">
                    <span className="label">Role:</span>
                    <span className="value">
                      {selectedUser.role === 'student'
                        ? '👨‍🎓 Student'
                        : '👨‍🏫 Teacher'}
                    </span>
                  </div>
                  {selectedUser.class && (
                    <div className="detail-row">
                      <span className="label">Class:</span>
                      <span className="value">{selectedUser.class}</span>
                    </div>
                  )}
                  {selectedUser.studentId && (
                    <div className="detail-row">
                      <span className="label">Student ID:</span>
                      <span className="value">{selectedUser.studentId}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Registration Date:</span>
                    <div className="value">
                      <Calendar size={16} />
                      {new Date(selectedUser.joinDate).toLocaleString()}
                    </div>
                  </div>
                  <div className="detail-row">
                    <span className="label">Max Books:</span>
                    <span className="value">{selectedUser.maxBooks}</span>
                  </div>
                </div>

                {selectedUser.interests && selectedUser.interests.length > 0 && (
                  <div className="detail-group">
                    <h4>Study Interests</h4>
                    <div className="tags">
                      {selectedUser.interests.map((interest: string) => (
                        <span key={interest} className="tag">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedUser.status === 'pending' && (
                <div className="action-buttons">
                  <button
                    onClick={() => handleApprove(selectedUser.id)}
                    className="btn btn-approve"
                  >
                    <CheckCircle size={18} />
                    Approve Registration
                  </button>
                  <button
                    onClick={() => handleReject(selectedUser.id)}
                    className="btn btn-reject"
                  >
                    <XCircle size={18} />
                    Reject Registration
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .librarian-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .librarian-header {
          max-width: 1200px;
          margin: 0 auto 30px;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 20px;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .header-content {
          text-align: center;
          color: white;
        }

        .header-icon {
          margin-bottom: 15px;
        }

        .header-content h1 {
          font-size: 32px;
          margin: 10px 0 8px;
          font-weight: 700;
        }

        .header-content p {
          font-size: 16px;
          opacity: 0.9;
        }

        .librarian-content {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .management-tabs {
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
          position: relative;
        }

        .tab.active {
          color: #667eea;
          border-bottom: 3px solid #667eea;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #667eea;
        }

        .badge {
          background: #e74c3c;
          color: white;
          border-radius: 12px;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: bold;
        }

        .management-section,
        .user-detail-section {
          padding: 30px;
        }

        .users-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-item {
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          text-align: left;
        }

        .user-item:hover {
          border-color: #667eea;
          background: #f5f5ff;
          transform: translateX(5px);
        }

        .user-item.pending {
          background: #fffaf0;
          border-color: #ff9800;
        }

        .user-main {
          flex: 1;
        }

        .user-item h4 {
          margin: 0 0 8px;
          color: #333;
          font-size: 16px;
        }

        .user-email {
          margin: 0 0 8px;
          color: #667eea;
          font-size: 13px;
        }

        .user-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #999;
        }

        .role {
          color: #667eea;
          font-weight: 600;
        }

        .class {
          background: #f0f5ff;
          padding: 2px 6px;
          border-radius: 3px;
          color: #667eea;
        }

        .user-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.pending {
          background: #ffe0b2;
          color: #e65100;
        }

        .status-badge.approved {
          background: #c8e6c9;
          color: #2e7d32;
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
          margin: 0;
          color: #666;
        }

        .user-detail-card {
          background: #f9f9f9;
          border-radius: 8px;
          padding: 30px;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }

        .detail-header h2 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .detail-content {
          margin-bottom: 30px;
        }

        .detail-group {
          margin-bottom: 25px;
        }

        .detail-group h4 {
          margin: 0 0 15px;
          color: #333;
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #667eea;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 600;
          color: #333;
          min-width: 150px;
        }

        .value {
          color: #666;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: #667eea;
          color: white;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 30px;
          padding-top: 30px;
          border-top: 2px solid #e0e0e0;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          font-size: 16px;
        }

        .btn-approve {
          background: #4caf50;
          color: white;
        }

        .btn-approve:hover {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(76, 175, 80, 0.3);
        }

        .btn-reject {
          background: #e74c3c;
          color: white;
        }

        .btn-reject:hover {
          background: #c0392b;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(231, 76, 60, 0.3);
        }

        @media (max-width: 768px) {
          .action-buttons {
            grid-template-columns: 1fr;
          }

          .detail-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
        }
      `}</style>
    </div>
  )
}
