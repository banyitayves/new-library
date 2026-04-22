'use client'

import { useState, useEffect } from 'react'
import { Send, MessageSquare, CheckCircle, Phone } from 'lucide-react'
import { getUsers, getTransactions, getBooks } from '@/lib/database'
import { addNotification } from '@/lib/features'

interface SMSNotificationsProps {
  onBack: () => void
}

export default function SMSNotifications({ onBack }: SMSNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [sentSMS, setSentSMS] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<'due-date' | 'overdue' | 'return' | 'fine'>('due-date')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    const users = getUsers()
    const transactions = getTransactions()
    const books = getBooks()
    const now = new Date()

    let toNotify: any[] = []

    transactions.forEach(trans => {
      const user = users.find(u => u.id === trans.memberId)
      const book = books.find(b => b.id === trans.bookId)

      if (!trans.returnDate && user && book) {
        const dueDate = new Date(trans.dueDate)
        const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        // Due in 2 days
        if (daysUntilDue === 2) {
          toNotify.push({
            type: 'due-date',
            user,
            book,
            transaction: trans,
            message: `Dear ${user.name}, your book "${book.title}" is due in 2 days on ${dueDate.toLocaleDateString()}. Please return it on time.`,
            phone: user.phone,
          })
        }

        // Overdue
        if (daysUntilDue < 0) {
          toNotify.push({
            type: 'overdue',
            user,
            book,
            transaction: trans,
            message: `URGENT: Dear ${user.name}, your book "${book.title}" is OVERDUE by ${Math.abs(daysUntilDue)} days. Please return it immediately.`,
            phone: user.phone,
          })
        }
      }
    })

    setNotifications(toNotify)
  }

  const sendSMSNotifications = async () => {
    setLoading(true)

    try {
      let sent = 0
      notifications.forEach(notif => {
        if (!selectedType || notif.type === selectedType) {
          // Simulate SMS sending
          setSentSMS(prev => [...prev, {
            ...notif,
            sentAt: new Date().toISOString(),
            status: 'sent',
          }])
          sent++

          // Also add to notifications in database
          addFeatureNotification({
            userId: notif.user.id,
            type: notif.type as any,
            title: notif.type === 'overdue' ? '⚠️ Overdue Book' : '📅 Due Date Reminder',
            message: notif.message,
            read: false,
            bookId: notif.book.id,
          })
        }
      })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      alert(`✅ ${sent} SMS notifications sent successfully!`)
    } catch (error) {
      alert('Error sending SMS notifications')
    } finally {
      setLoading(false)
    }
  }

  const filteredNotifications = notifications.filter(n => 
    selectedType === 'fine' ? false : n.type === selectedType
  )

  return (
    <div className="sms-container">
      <div className="sms-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>📱 Automatic SMS Notifications</h1>
      </div>

      <div className="sms-content">
        <div className="filter-tabs">
          <button
            className={`tab ${selectedType === 'due-date' ? 'active' : ''}`}
            onClick={() => setSelectedType('due-date')}
          >
            📅 Due Date ({notifications.filter(n => n.type === 'due-date').length})
          </button>
          <button
            className={`tab ${selectedType === 'overdue' ? 'active' : ''}`}
            onClick={() => setSelectedType('overdue')}
          >
            ⚠️ Overdue ({notifications.filter(n => n.type === 'overdue').length})
          </button>
          <button
            className={`tab ${selectedType === 'return' ? 'active' : ''}`}
            onClick={() => setSelectedType('return')}
          >
            ✓ Return Confirmed (0)
          </button>
          <button
            className={`tab ${selectedType === 'fine' ? 'active' : ''}`}
            onClick={() => setSelectedType('fine')}
          >
            💰 Fine Payment (0)
          </button>
        </div>

        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={40} />
              <p>No {selectedType === 'due-date' ? 'due date' : 'overdue'} notifications needed</p>
            </div>
          ) : (
            filteredNotifications.map((notif, idx) => (
              <div key={idx} className={`notification-card ${notif.type}`}>
                <div className="notif-header">
                  <div>
                    <h3>{notif.user.name}</h3>
                    <p className="phone">
                      <Phone size={14} /> {notif.phone || 'No phone'}
                    </p>
                  </div>
                  <span className={`badge ${notif.type}`}>
                    {notif.type === 'due-date' ? '📅' : '⚠️'}
                  </span>
                </div>
                <p className="book-info">📚 <strong>{notif.book.title}</strong> by {notif.book.author}</p>
                <p className="message">{notif.message}</p>
                <div className="notif-meta">
                  <span>Borrow: {new Date(notif.transaction.borrowDate).toLocaleDateString()}</span>
                  <span>Due: {new Date(notif.transaction.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="action-section">
          <button
            onClick={sendSMSNotifications}
            disabled={loading || filteredNotifications.length === 0}
            className="send-btn"
          >
            <Send size={18} />
            {loading ? 'Sending...' : `Send ${filteredNotifications.length} SMS`}
          </button>
        </div>

        {sentSMS.length > 0 && (
          <div className="sent-history">
            <h3>✅ Recently Sent ({sentSMS.length})</h3>
            <div className="sent-list">
              {sentSMS.slice(-5).map((sms, idx) => (
                <div key={idx} className="sent-item">
                  <CheckCircle size={16} className="success-icon" />
                  <div className="sent-info">
                    <p><strong>{sms.user.name}</strong> • {sms.book.title}</p>
                    <small>{new Date(sms.sentAt).toLocaleTimeString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .sms-container {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 20px;
        }

        .sms-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .back-btn {
          background: #f0f0f0;
          border: 2px solid #ddd;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .back-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .sms-header h1 {
          flex: 1;
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .sms-content {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .filter-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
        }

        .tab {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
        }

        .notification-list {
          margin-bottom: 25px;
        }

        .empty-state {
          text-align: center;
          padding: 50px 20px;
          color: #888;
        }

        .empty-state p {
          margin-top: 15px;
          font-size: 16px;
        }

        .notification-card {
          background: #f8f9fa;
          border-left: 4px solid #667eea;
          padding: 20px;
          margin-bottom: 15px;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .notification-card.overdue {
          border-left-color: #f44336;
          background: #ffebee;
        }

        .notification-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
        }

        .notif-header h3 {
          margin: 0;
          color: #333;
          font-size: 16px;
        }

        .phone {
          margin: 5px 0 0;
          color: #666;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .badge {
          font-size: 24px;
        }

        .book-info {
          margin: 10px 0;
          color: #333;
          font-size: 14px;
        }

        .message {
          background: white;
          padding: 12px;
          border-radius: 6px;
          color: #666;
          font-size: 14px;
          line-height: 1.5;
          margin: 10px 0;
          border-left: 3px solid #667eea;
        }

        .notif-meta {
          display: flex;
          gap: 20px;
          font-size: 12px;
          color: #888;
          margin-top: 10px;
        }

        .action-section {
          text-align: center;
          padding: 20px;
          border-top: 2px solid #eee;
        }

        .send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 auto;
          transition: all 0.3s;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .sent-history {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #eee;
        }

        .sent-history h3 {
          color: #333;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .sent-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sent-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          background: #e8f5e9;
          border-radius: 6px;
          border-left: 3px solid #4caf50;
        }

        .success-icon {
          color: #4caf50;
        }

        .sent-info {
          flex: 1;
        }

        .sent-info p {
          margin: 0;
          color: #333;
          font-size: 14px;
        }

        .sent-info small {
          color: #888;
          font-size: 12px;
          display: block;
          margin-top: 3px;
        }
      `}</style>
    </div>
  )
}
