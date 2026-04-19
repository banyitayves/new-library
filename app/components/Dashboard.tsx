'use client'

import { useState } from 'react'
import BooksSection from './BooksSection'
import MembersSection from './MembersSection'
import TransactionsSection from './TransactionsSection'
import NotificationsSection from './NotificationsSection'
import { LogOut, Home, BookOpen, Users, Send, Bell } from 'lucide-react'

interface DashboardProps {
  user: any
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState('home')

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
