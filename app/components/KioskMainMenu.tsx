'use client'

// Removed unused React hooks import
import { Monitor, LogIn } from 'lucide-react'

interface KioskMainMenuProps {
  onEnterKiosk: () => void
  onEnterAdmin: () => void
}

export default function KioskMainMenu({ onEnterKiosk, onEnterAdmin }: KioskMainMenuProps) {
  return (
    <div className="kiosk-main-menu">
      <div className="menu-content">
        <div className="menu-header">
          <h1>📚 GS Busanza Library</h1>
          <p>Welcome to our Self-Service System</p>
        </div>

        <div className="menu-options">
          <button onClick={onEnterKiosk} className="menu-card kiosk-card">
            <Monitor size={64} />
            <h2>Student Kiosk</h2>
            <p>Borrow books, manage your account, and chat with others</p>
            <span className="menu-btn">
              <LogIn size={20} /> Enter Kiosk
            </span>
          </button>

          <button onClick={onEnterAdmin} className="menu-card admin-card">
            <Monitor size={64} />
            <h2>Librarian Dashboard</h2>
            <p>Manage books, members, and library operations</p>
            <span className="menu-btn">
              <LogIn size={20} /> Enter Dashboard
            </span>
          </button>
        </div>

        <div className="menu-footer">
          <h3>How to Use the Kiosk</h3>
          <div className="instructions">
            <div className="step">
              <span className="step-number">1</span>
              <p>Click "Student Kiosk" to begin</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Enter your Student ID or scan your library card</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Browse and borrow books, chat with peers</p>
            </div>
            <div className="step">
              <span className="step-number">4</span>
              <p>Contact library staff if you need help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
