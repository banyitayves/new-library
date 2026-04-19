'use client'

import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import AuthModal from './components/AuthModal'
import KioskLoginComponent from './components/KioskLogin'
import KioskModeComponent from './components/KioskMode'
import KioskMainMenuComponent from './components/KioskMainMenu'
import './globals.css'

export default function Home() {
  const [mode, setMode] = useState<'menu' | 'admin' | 'kiosk-login' | 'kiosk'>('menu')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      setCurrentUser(JSON.parse(stored))
      setIsAuthenticated(true)
    }
  }, [])

  const handleAdminLogin = (user: any) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    setMode('admin')
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  const handleKioskLogin = (user: any) => {
    setCurrentUser(user)
    setMode('kiosk')
    // Don't store in localStorage for kiosk mode for security
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

  return (
    <main>
      {mode === 'menu' && (
        <KioskMainMenuComponent
          onEnterKiosk={() => setMode('kiosk-login')}
          onEnterAdmin={() => setMode('admin')}
        />
      )}

      {mode === 'admin' && !isAuthenticated && (
        <AuthModal onLogin={handleAdminLogin} />
      )}

      {mode === 'admin' && isAuthenticated && (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      )}

      {mode === 'kiosk-login' && (
        <KioskLoginComponent
          onLogin={handleKioskLogin}
          onBackToMain={() => setMode('menu')}
        />
      )}

      {mode === 'kiosk' && currentUser && (
        <KioskModeComponent
          user={currentUser}
          onLogout={() => {
            setCurrentUser(null)
            setMode('menu')
          }}
          onBackToMain={() => setMode('menu')}
        />
      )}
    </main>
  )
}
