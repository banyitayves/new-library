'use client'

import { useState } from 'react'
import BooksSection from './BooksSection'
import MembersSection from './MembersSection'
import TransactionsSection from './TransactionsSection'
import NotificationsSection from './NotificationsSection'
import { LogOut, Home, BookOpen, Users, Send, Bell, Sparkles, Users2, QrCode } from 'lucide-react'

interface DashboardProps {
  user?: any
  onLogout?: () => void
  onAdminLogin?: (user: any) => void
  onKioskMode?: () => void
  onLoginRegister?: () => void
}

export default function Dashboard({
  user,
  onLogout,
  onAdminLogin,
  onKioskMode,
  onLoginRegister,
}: DashboardProps) {
  const [activeSection, setActiveSection] = useState('home')
  const [adminPassword, setAdminPassword] = useState('')
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [deputyPassword, setDeputyPassword] = useState('')
  const [showDeputyLogin, setShowDeputyLogin] = useState(false)

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check (in production, use proper authentication)
    if (adminPassword === 'admin123') {
      const adminUser = { id: 'admin', name: 'Librarian', role: 'librarian' }
      onAdminLogin?.(adminUser)
      setAdminPassword('')
    } else {
      alert('Invalid password')
    }
  }

  const handleDeputyLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check for deputy (in production, use proper authentication)
    if (deputyPassword === 'deputy123') {
      const deputyUser = { id: 'deputy', name: 'Deputy Head Teacher', role: 'deputy', status: 'approved' }
      // Simulate login by storing deputy user
      localStorage.setItem('currentUser', JSON.stringify(deputyUser))
      window.location.reload() // Reload to trigger mode detection
    } else {
      alert('Invalid password')
    }
  }

  // Menu mode (when no user is logged in)
  if (!user) {
    return (
      <div className="main-menu">
        <div className="menu-container">
          <div className="menu-header">
            <h1>📚 GS Busanza Library</h1>
            <p>Advanced Library Management System</p>
          </div>

          <div className="menu-options">
            <button onClick={onLoginRegister} className="menu-btn primary">
              <Users2 size={32} />
              <span>Student / Teacher</span>
              <p>Login or Register</p>
            </button>

            {showAdminLogin ? (
              <form onSubmit={handleAdminLogin} className="admin-login-form">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter librarian password"
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminLogin(false)
                    setAdminPassword('')
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="menu-btn secondary"
              >
                <Home size={32} />
                <span>Librarian</span>
                <p>Admin Control Panel</p>
              </button>
            )}

            {showDeputyLogin ? (
              <form onSubmit={handleDeputyLogin} className="admin-login-form">
                <input
                  type="password"
                  value={deputyPassword}
                  onChange={(e) => setDeputyPassword(e.target.value)}
                  placeholder="Enter deputy password"
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeputyLogin(false)
                    setDeputyPassword('')
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowDeputyLogin(true)}
                className="menu-btn secondary"
              >
                <Users2 size={32} />
                <span>Deputy Head</span>
                <p>View Students & History</p>
              </button>
            )}

            <button onClick={onKioskMode} className="menu-btn secondary">
              <QrCode size={32} />
              <span>Kiosk Mode</span>
              <p>Borrow with Barcode</p>
            </button>
          </div>

          <style jsx>{`
            .main-menu {
              min-height: 100vh;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }

            .menu-container {
              max-width: 800px;
              width: 100%;
              background: white;
              border-radius: 16px;
              padding: 50px 40px;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }

            .menu-header h1 {
              font-size: 36px;
              margin: 0 0 10px;
              color: #333;
              font-weight: 700;
            }

            .menu-header p {
              font-size: 16px;
              color: #666;
              margin: 0 0 40px;
            }

            .menu-options {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
            }

            .menu-btn {
              background: white;
              border: 3px solid #e0e0e0;
              padding: 30px 20px;
              border-radius: 12px;
              cursor: pointer;
              transition: all 0.3s;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 15px;
              font-weight: 600;
            }

            .menu-btn:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }

            .menu-btn.primary {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border-color: transparent;
            }

            .menu-btn.primary:hover {
              box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            }

            .menu-btn.secondary:hover {
              border-color: #667eea;
              color: #667eea;
            }

            .menu-btn span {
              font-size: 18px;
            }

            .menu-btn p {
              margin: 0;
              font-size: 12px;
              opacity: 0.8;
              font-weight: normal;
            }

            .admin-login-form {
              grid-column: span 2;
              display: flex;
              gap: 10px;
            }

            .admin-login-form input {
              flex: 1;
              padding: 10px 15px;
              border: 2px solid #e0e0e0;
              border-radius: 6px;
              font-size: 14px;
            }

            .admin-login-form input:focus {
              outline: none;
              border-color: #667eea;
            }

            .btn {
              padding: 10px 20px;
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
            }

            .btn-secondary {
              background: #e0e0e0;
              color: #333;
            }

            .btn-secondary:hover {
              background: #d0d0d0;
            }

            @media (max-width: 768px) {
              .menu-container {
                padding: 30px 20px;
              }

              .menu-options {
                grid-template-columns: 1fr;
              }

              .admin-login-form {
                grid-column: 1;
              }
            }
          `}</style>
        </div>
      </div>
    )
  }

  // Admin dashboard mode
  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-brand">
          <h1>📚 GS Busanza Library</h1>
        </div>
        <div className="navbar-user">
          <span>{user?.name || 'User'}</span>
          <button onClick={onLogout} className="btn btn-danger">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <button
            className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}
            onClick={() => setActiveSection('home')}
          >
            <Home size={20} /> Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'books' ? 'active' : ''}`}
            onClick={() => setActiveSection('books')}
          >
            <BookOpen size={20} /> Books
          </button>
          <button
            className={`nav-item ${activeSection === 'members' ? 'active' : ''}`}
            onClick={() => setActiveSection('members')}
          >
            <Users size={20} /> Members
          </button>
          <button
            className={`nav-item ${activeSection === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveSection('transactions')}
          >
            <Send size={20} /> Transactions
          </button>
          <button
            className={`nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <Bell size={20} /> Notifications
          </button>
        </aside>

        <main className="dashboard-content">
          {activeSection === 'home' && (
            <div className="section-home">
              <h2>Welcome to GS Busanza Library Management System</h2>
              <p>Hello {user?.name}! You can manage books, members, and transactions from the sidebar.</p>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>📚 Total Books</h3>
                  <p className="stat-number">0</p>
                </div>
                <div className="stat-card">
                  <h3>👥 Members</h3>
                  <p className="stat-number">0</p>
                </div>
                <div className="stat-card">
                  <h3>📤 Active Loans</h3>
                  <p className="stat-number">0</p>
                </div>
                <div className="stat-card">
                  <h3>⚠️ Overdue Books</h3>
                  <p className="stat-number">0</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'books' && <BooksSection />}
          {activeSection === 'members' && <MembersSection />}
          {activeSection === 'transactions' && <TransactionsSection />}
          {activeSection === 'notifications' && <NotificationsSection />}
        </main>
      </div>
    </div>
  )
}
