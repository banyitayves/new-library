'use client'

import { useState } from 'react'
import { BookOpen, Barcode, LogIn } from 'lucide-react'
import { findMemberByStudentId, findMemberByBarcode } from '@/lib/database'

interface KioskLoginProps {
  onLogin: (user: any) => void
  onBackToMain: () => void
}

export default function KioskLogin({ onLogin, onBackToMain }: KioskLoginProps) {
  const [loginMethod, setLoginMethod] = useState<'studentId' | 'barcode'>('studentId')
  const [studentId, setStudentId] = useState('')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [error, setError] = useState('')

  const handleStudentIdLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const member = findMemberByStudentId(studentId)
    if (member) {
      onLogin({
        ...member,
        type: 'student',
      })
    } else {
      setError('Student ID not found. Please check and try again.')
      setStudentId('')
    }
  }

  const handleBarcodeLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const member = findMemberByBarcode(barcodeInput)
    if (member) {
      onLogin({
        ...member,
        type: 'student',
      })
    } else {
      setError('Card barcode not found. Please check and try again.')
      setBarcodeInput('')
    }
  }

  return (
    <div className="kiosk-login-container">
      <div className="kiosk-login-card">
        <div className="kiosk-header">
          <BookOpen size={48} />
          <h1>GS Busanza Library</h1>
          <p>Self-Service Kiosk</p>
        </div>

        <div className="kiosk-method-selector">
          <button
            className={`method-btn ${loginMethod === 'studentId' ? 'active' : ''}`}
            onClick={() => {
              setLoginMethod('studentId')
              setError('')
            }}
          >
            👤 Student ID
          </button>
          <button
            className={`method-btn ${loginMethod === 'barcode' ? 'active' : ''}`}
            onClick={() => {
              setLoginMethod('barcode')
              setError('')
            }}
          >
            <Barcode size={20} /> Scan Card
          </button>
        </div>

        {loginMethod === 'studentId' && (
          <form onSubmit={handleStudentIdLogin} className="kiosk-form">
            <div className="kiosk-input-group">
              <label>Enter Your Student ID</label>
              <input
                type="text"
                placeholder="e.g., GSB-001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                autoFocus
                required
                className="kiosk-input"
              />
            </div>
            <button type="submit" className="kiosk-btn kiosk-btn-primary">
              <LogIn size={20} /> Login
            </button>
          </form>
        )}

        {loginMethod === 'barcode' && (
          <form onSubmit={handleBarcodeLogin} className="kiosk-form">
            <div className="kiosk-input-group">
              <label>Place your barcode on scanner</label>
              <p className="kiosk-hint">
                (Or paste barcode value below)
              </p>
              <input
                type="text"
                placeholder="Scan barcode here..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                autoFocus
                required
                className="kiosk-input"
              />
            </div>
            <button type="submit" className="kiosk-btn kiosk-btn-primary">
              <Barcode size={20} /> Scan & Login
            </button>
          </form>
        )}

        {error && (
          <div className="kiosk-error">
            <p>⚠️ {error}</p>
          </div>
        )}

        <button
          onClick={onBackToMain}
          className="kiosk-btn kiosk-btn-secondary"
        >
          Back to Main Menu
        </button>

        <div className="kiosk-footer">
          <p>🔒 Your information is secure</p>
          <p>For help, contact the library staff</p>
        </div>
      </div>
    </div>
  )
}
