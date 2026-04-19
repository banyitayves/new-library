'use client'

import { useState } from 'react'
import { Send, Bell } from 'lucide-react'

export default function NotificationsSection() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [selectedType, setSelectedType] = useState('general')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/twilio/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          message,
          type: selectedType,
        }),
      })

      const data = await response.json()
      setResult(data)
      if (data.success) {
        setPhoneNumber('')
        setMessage('')
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send SMS',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckDueBooks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/twilio/check-due-books')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check due books',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <h2>SMS Notifications & Automation</h2>

      <div className="notification-cards">
        <div className="card">
          <h3>📬 Send Manual SMS</h3>
          <p>Send a custom SMS message to a member</p>
          <form onSubmit={handleSendSMS} className="form-card">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="+250XXX000000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Notification Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="general">General</option>
                <option value="due-reminder">Due Reminder</option>
                <option value="new-book">New Book</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                placeholder="Enter message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Send size={18} /> {loading ? 'Sending...' : 'Send SMS'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>📅 Automatic Due Reminders</h3>
          <p>Send automated reminders for books due soon or overdue</p>
          <button
            onClick={handleCheckDueBooks}
            className="btn btn-primary"
            disabled={loading}
          >
            <Bell size={18} /> {loading ? 'Checking...' : 'Check & Send Reminders'}
          </button>
          <p className="help-text">
            This will check all active loans and send SMS reminders to members
            with overdue books
          </p>
        </div>

        <div className="card">
          <h3>🎊 New Book Notifications</h3>
          <p>Automatically notify members when new books are added</p>
          <button disabled className="btn btn-secondary">
            Auto-enabled: Members notified on new books
          </button>
        </div>

        <div className="card">
          <h3>🎉 Event Notifications</h3>
          <p>Send notifications about library events and challenges</p>
          <button disabled className="btn btn-secondary">
            Auto-enabled: Members notified on events
          </button>
        </div>
      </div>

      {result && (
        <div className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}>
          <h4>{result.success ? '✓ Success' : '✗ Error'}</h4>
          <p>{result.message || result.error}</p>
          {result.count && <p>Messages sent: {result.count}</p>}
        </div>
      )}
    </div>
  )
}
