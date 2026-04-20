'use client'

import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import AuthModal from './components/AuthModal'
import KioskLoginComponent from './components/KioskLogin'
import KioskModeComponent from './components/KioskMode'
// Removed unused KioskMainMenuComponent import
import LoginRegister from './components/LoginRegister'
import PendingApproval from './components/PendingApproval'
import StudentDashboard from './components/StudentDashboard'
import AIRecommendations from './components/AIRecommendations'
import QASystem from './components/QASystem'
import LibrarianPanel from './components/LibrarianPanel'
import DeputyPanel from './components/DeputyPanel'
import SearchBooks from './components/SearchBooks'
import GuestMode from './components/GuestMode'
import DigitalLibrary from './components/DigitalLibrary'
import AIChat from './components/AIChat'
import HelpContact from './components/HelpContact'
import LibrarianSettings from './components/LibrarianSettings'
import './globals.css'

export default function Home() {
  const [mode, setMode] = useState<
    | 'menu'
    | 'admin'
    | 'kiosk-login'
    | 'kiosk'
    | 'login-register'
    | 'pending-approval'
    | 'student-dashboard'
    | 'librarian-panel'
    | 'librarian-settings'
    | 'deputy-panel'
    | 'guest-mode'
    | 'ai-recommendations'
    | 'qa-system'
    | 'search-books'
    | 'digital-library'
    | 'ai-chat'
    | 'help-contact'
  >('menu')
  // Removed unused isAuthenticated state
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      const user = JSON.parse(stored)
      setCurrentUser(user)
      setIsAuthenticated(true)

      // Determine initial mode based on role and status
      if (user.role === 'librarian') {
        setMode('librarian-panel')
      } else if (user.role === 'deputy') {
        setMode('deputy-panel')
      } else if (user.status === 'pending') {
        setMode('pending-approval')
      } else {
        setMode('student-dashboard')
      }
    }
  }, [])

  const handleAdminLogin = (user: any) => {
    const librarianUser = {
      ...user,
      role: 'librarian',
      status: 'approved',
    }
    setCurrentUser(librarianUser)
    setIsAuthenticated(true)
    setMode('librarian-panel')
    localStorage.setItem('currentUser', JSON.stringify(librarianUser))
  }

  const handleKioskLogin = (user: any) => {
    setCurrentUser(user)
    setMode('kiosk')
    // Don't store in localStorage for kiosk mode for security
  }

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    localStorage.setItem('currentUser', JSON.stringify(user))

    // Route based on role
    if (user.role === 'librarian') {
      setMode('librarian-panel')
    } else if (user.role === 'deputy') {
      setMode('deputy-panel')
    } else if (user.status === 'pending') {
      setMode('pending-approval')
    } else {
      setMode('student-dashboard')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setMode('menu')
    localStorage.removeItem('currentUser')
  }

  const handleBackToMenu = () => {
    setCurrentUser(null)
    setMode('menu')
  }

  const handleGuestMode = () => {
    setMode('guest-mode')
  }

  const handleExitGuestMode = () => {
    setMode('menu')
  }

  const handleNavigate = (view: string) => {
    setMode(view as any)
  }

  return (
    <main>
      {mode === 'menu' && (
        <Dashboard
          onAdminLogin={handleAdminLogin}
          onKioskMode={() => setMode('kiosk-login')}
          onLoginRegister={() => setMode('login-register')}
          onAIChat={() => setMode('ai-chat')}
        />
      )}

      {mode === 'admin' && (
        <AuthModal
          isOpen={mode === 'admin'}
          onClose={handleLogout}
          currentUser={currentUser}
        />
      )}

      {mode === 'kiosk-login' && (
        <KioskLoginComponent
          onLogin={handleKioskLogin}
          onBackToMain={handleBackToMenu}
        />
      )}

      {mode === 'kiosk' && (
        <KioskModeComponent
          user={currentUser}
          onLogout={handleBackToMenu}
        />
      )}

      {mode === 'login-register' && (
        <LoginRegister
          onLoginSuccess={handleLoginSuccess}
          onGuestMode={handleGuestMode}
        />
      )}

      {mode === 'pending-approval' && currentUser && (
        <PendingApproval
          userName={currentUser.name}
          userEmail={currentUser.email}
          userRole={currentUser.role}
          onLogout={handleLogout}
        />
      )}

      {mode === 'student-dashboard' && currentUser && (
        <StudentDashboard
          user={currentUser}
          onLogout={handleLogout}
          onNavigate={handleNavigate}
        />
      )}

      {mode === 'librarian-panel' && (
        <LibrarianPanel 
          onBack={handleLogout} 
          onNavigateToSettings={() => setMode('librarian-settings')}
        />
      )}

      {mode === 'librarian-settings' && currentUser && (
        <LibrarianSettings 
          onBack={() => setMode('librarian-panel')} 
          librarianId={currentUser.id}
        />
      )}

      {mode === 'deputy-panel' && (
        <DeputyPanel onLogout={handleLogout} />
      )}

      {mode === 'guest-mode' && (
        <GuestMode onExit={handleExitGuestMode} />
      )}

      {mode === 'ai-recommendations' && currentUser && (
        <AIRecommendations
          userId={currentUser.id}
          userName={currentUser.name}
          onBack={() => setMode('student-dashboard')}
        />
      )}

      {mode === 'qa-system' && currentUser && (
        <QASystem
          userId={currentUser.id}
          userName={currentUser.name}
          userRole={currentUser.role}
          onBack={() => setMode('student-dashboard')}
        />
      )}

      {mode === 'search-books' && currentUser && (
        <SearchBooks
          userId={currentUser.id}
          onBack={() => setMode('student-dashboard')}
        />
      )}

      {mode === 'digital-library' && (
        <DigitalLibrary onNavigate={handleNavigate} />
      )}

      {mode === 'ai-chat' && (
        <AIChat onClose={() => setMode(currentUser ? 'student-dashboard' : 'menu')} />
      )}

      {mode === 'help-contact' && currentUser && (
        <HelpContact 
          onBack={() => setMode('student-dashboard')} 
          currentUser={currentUser}
        />
      )}
    </main>
  )
}
