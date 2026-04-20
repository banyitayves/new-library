'use client'

import { useState, useEffect } from 'react'
import { Mail, Bell, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { getLibrarianSettings, setLibrarianEmail, updateLibrarianNotificationSettings } from '@/lib/database'

interface LibrarianSettingsProps {
  onBack?: () => void
  librarianId?: string
}

export default function LibrarianSettings({ onBack, librarianId }: LibrarianSettingsProps) {
  const [email, setEmail] = useState('')
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [notifyBorrow, setNotifyBorrow] = useState(true)
  const [notifyReturn, setNotifyReturn] = useState(true)
  const [notifyHelp, setNotifyHelp] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    const savedSettings = getLibrarianSettings()
    if (savedSettings) {
      setSettings(savedSettings)
      setEmail(savedSettings.email)
      setNotifyBorrow(savedSettings.notifyOnBorrow)
      setNotifyReturn(savedSettings.notifyOnReturn)
      setNotifyHelp(savedSettings.notifyOnHelpRequest)
    }
  }

  const handleSaveEmail = () => {
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter an email address' })
      return
    }

    if (!isValidEmail(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' })
      return
    }

    setLoading(true)
    try {
      const updated = setLibrarianEmail(librarianId || 'librarian', email)
      setSettings(updated)
      setMessage({ type: 'success', text: `Email saved! Notifications will be sent to ${email}` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSettings = () => {
    setLoading(true)
    try {
      const updated = updateLibrarianNotificationSettings(librarianId || 'librarian', {
        notifyOnBorrow,
        notifyOnReturn,
        notifyOnHelpRequest: notifyHelp,
      })
      setSettings(updated)
      setMessage({ type: 'success', text: 'Notification preferences updated!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        {onBack && (
          <button onClick={onBack} className="back-btn">
            ← Back
          </button>
        )}
        <h1>⚙️ Librarian Notification Settings</h1>
        <p>Configure how you receive notifications about library activities</p>
      </div>

      <div className="settings-content">
        {/* Email Settings */}
        <div className="settings-section">
          <div className="section-header">
            <Mail size={24} />
            <h2>📧 Email Notifications</h2>
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <div className="email-form">
            <label>Email Address</label>
            <div className="email-input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="librarian@school.edu"
                className="email-input"
                disabled={loading}
              />
              <button
                onClick={handleSaveEmail}
                disabled={loading || !email.trim()}
                className="save-btn"
              >
                {loading ? 'Saving...' : 'Save Email'}
              </button>
            </div>
            {settings?.email && (
              <p className="email-info">
                ✓ Current email: <strong>{settings.email}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="settings-section">
          <div className="section-header">
            <Bell size={24} />
            <h2>🔔 Notification Preferences</h2>
          </div>

          <div className="preferences-list">
            <label className="preference-item">
              <input
                type="checkbox"
                checked={notifyBorrow}
                onChange={(e) => setNotifyBorrow(e.target.checked)}
                disabled={loading}
              />
              <div className="preference-content">
                <span className="preference-title">Book Borrowing Notifications</span>
                <span className="preference-desc">Get notified when someone borrows a book</span>
              </div>
            </label>

            <label className="preference-item">
              <input
                type="checkbox"
                checked={notifyReturn}
                onChange={(e) => setNotifyReturn(e.target.checked)}
                disabled={loading}
              />
              <div className="preference-content">
                <span className="preference-title">Book Return Notifications</span>
                <span className="preference-desc">Get notified when books are returned</span>
              </div>
            </label>

            <label className="preference-item">
              <input
                type="checkbox"
                checked={notifyHelp}
                onChange={(e) => setNotifyHelp(e.target.checked)}
                disabled={loading}
              />
              <div className="preference-content">
                <span className="preference-title">Help Request Notifications</span>
                <span className="preference-desc">Get notified when users request help</span>
              </div>
            </label>
          </div>

          <button
            onClick={handleUpdateSettings}
            disabled={loading}
            className="update-btn"
          >
            {loading ? 'Updating...' : 'Update Preferences'}
          </button>
        </div>

        {/* Current Status */}
        <div className="status-section">
          <h3>📊 Notification Status</h3>
          <div className="status-info">
            <p>
              <strong>Email:</strong> {settings?.email ? (
                <span className="status-active">✓ {settings.email}</span>
              ) : (
                <span className="status-inactive">Not configured</span>
              )}
            </p>
            <p>
              <strong>Email Notifications:</strong> {settings?.enableEmailNotifications ? (
                <span className="status-active">✓ Enabled</span>
              ) : (
                <span className="status-inactive">Disabled</span>
              )}
            </p>
            <p>
              <strong>Active Notifications:</strong>
            </p>
            <ul className="notification-list">
              {notifyBorrow && <li>✓ Book borrowing</li>}
              {notifyReturn && <li>✓ Book returns</li>}
              {notifyHelp && <li>✓ Help requests</li>}
            </ul>
          </div>
        </div>

        {/* Help Text */}
        <div className="help-section">
          <h3>💡 How It Works</h3>
          <ul>
            <li>Add your email address to receive notifications about library activities</li>
            <li>Choose which types of notifications you want to receive</li>
            <li>Notifications are sent to your email in real-time</li>
            <li>You can update your preferences anytime</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .settings-container {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 20px;
        }

        .settings-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
          position: relative;
        }

        .back-btn {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }

        .settings-header p {
          margin: 0;
          opacity: 0.9;
        }

        .settings-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .settings-section {
          background: white;
          padding: 25px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-header svg {
          color: #667eea;
        }

        h2 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .message {
          padding: 12px 15px;
          border-radius: 6px;
          margin-bottom: 15px;
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 14px;
        }

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border-left: 4px solid #4caf50;
        }

        .message.error {
          background: #ffebee;
          color: #c62828;
          border-left: 4px solid #f44336;
        }

        .email-form {
          margin-bottom: 15px;
        }

        label {
          display: block;
          margin-bottom: 10px;
          font-weight: 600;
          color: #333;
        }

        .email-input-group {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .email-input {
          flex: 1;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.3s;
        }

        .email-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .save-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .email-info {
          font-size: 13px;
          color: #2e7d32;
          margin: 0;
          padding: 10px;
          background: #e8f5e9;
          border-radius: 4px;
        }

        .preferences-list {
          margin-bottom: 15px;
        }

        .preference-item {
          display: flex;
          gap: 15px;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 10px;
          background: #f9f9f9;
          cursor: pointer;
          transition: all 0.3s;
          align-items: flex-start;
        }

        .preference-item:hover {
          background: #f0f0f0;
        }

        .preference-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
          margin-top: 2px;
          cursor: pointer;
        }

        .preference-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .preference-title {
          font-weight: 600;
          color: #333;
        }

        .preference-desc {
          font-size: 13px;
          color: #666;
        }

        .update-btn {
          width: 100%;
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
        }

        .update-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
        }

        .update-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-section {
          background: #f0f7ff;
          border: 2px solid #2196f3;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .status-section h3 {
          margin: 0 0 15px 0;
          color: #1565c0;
        }

        .status-info p {
          margin: 10px 0;
          color: #333;
        }

        .status-active {
          color: #2e7d32;
          font-weight: 600;
        }

        .status-inactive {
          color: #c62828;
          font-weight: 600;
        }

        .notification-list {
          list-style: none;
          padding: 0;
          margin: 8px 0 0 20px;
        }

        .notification-list li {
          color: #2e7d32;
          margin: 4px 0;
          font-size: 14px;
        }

        .help-section {
          background: #fffde7;
          border: 2px solid #fbc02d;
          padding: 20px;
          border-radius: 8px;
        }

        .help-section h3 {
          margin: 0 0 12px 0;
          color: #f57f17;
        }

        .help-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .help-section li {
          margin: 8px 0;
          padding-left: 20px;
          position: relative;
          color: #555;
        }

        .help-section li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #f57f17;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .settings-header {
            padding: 20px;
            padding-top: 50px;
          }

          .email-input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
