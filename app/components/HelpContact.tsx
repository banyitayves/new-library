'use client'

import { useState } from 'react'
import { Send, MessageSquare, AlertCircle, CheckCircle, X } from 'lucide-react'
import { sendHelpRequest } from '@/lib/features'

interface HelpContactProps {
  onBack: () => void
  currentUser?: any
}

export default function HelpContact({ onBack, currentUser }: HelpContactProps) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const commonIssues = [
    { title: 'How to borrow a book?', desc: 'I need help with the borrowing process' },
    { title: 'Book not available', desc: 'The book I want is not available' },
    { title: 'Technical issue', desc: 'I\'m experiencing a problem with the system' },
    { title: 'Account issue', desc: 'I have problems with my account' },
    { title: 'Return book', desc: 'I need help returning a book' },
    { title: 'Other', desc: 'Other issue not listed above' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!subject.trim()) {
      setError('Please select or enter a subject')
      return
    }

    if (!message.trim()) {
      setError('Please enter your message')
      return
    }

    setLoading(true)

    try {
      sendHelpRequest(
        currentUser?.id || 'guest',
        currentUser?.name || 'Anonymous User',
        subject,
        message,
        currentUser?.email
      )

      setSubmitted(true)
      setSubject('')
      setMessage('')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        onBack()
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to send help request')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickIssue = (issue: any) => {
    setSubject(issue.title)
    setMessage(issue.desc)
  }

  if (submitted) {
    return (
      <div className="help-container">
        <div className="help-success">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>Help Request Sent! ✅</h2>
          <p>Your message has been sent to librarian <strong>NSHIMIYIMANA Yves</strong></p>
          <p className="success-message">
            They will respond to your request as soon as possible. 
            Check your notifications for updates.
          </p>
          <button onClick={onBack} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>

        <style jsx>{`
          .help-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .help-success {
            background: white;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .success-icon {
            color: #4caf50;
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
          }

          h2 {
            color: #333;
            margin: 0 0 15px 0;
          }

          p {
            color: #666;
            margin: 10px 0;
            font-size: 15px;
            line-height: 1.6;
          }

          .success-message {
            color: #4caf50;
            font-weight: 500;
            margin: 20px 0;
          }

          .btn {
            margin-top: 20px;
            padding: 12px 30px;
            border: none;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }

          .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="help-container">
      <div className="help-header">
        <button onClick={onBack} className="back-btn">
          <X size={24} />
        </button>
        <div className="header-content">
          <MessageSquare size={32} className="header-icon" />
          <div>
            <h1>📞 Contact Librarian for Help</h1>
            <p>Send a message to <strong>NSHIMIYIMANA Yves</strong></p>
          </div>
        </div>
      </div>

      <div className="help-content">
        {/* Quick Issues */}
        <div className="quick-issues">
          <h3>Common Issues - Click to Select:</h3>
          <div className="issues-grid">
            {commonIssues.map((issue, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickIssue(issue)}
                className="issue-btn"
              >
                <span className="issue-title">{issue.title}</span>
                <span className="issue-desc">{issue.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Help Form */}
        <form onSubmit={handleSubmit} className="help-form">
          {error && (
            <div className="error-message">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What do you need help with?"
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Your Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              disabled={loading}
              rows={6}
              className="form-textarea"
            />
            <p className="char-count">{message.length} characters</p>
          </div>

          <div className="form-info">
            <AlertCircle size={16} />
            <p>Your request will be sent to the librarian. We usually respond within 24 hours.</p>
          </div>

          <button 
            type="submit" 
            disabled={loading || !subject.trim() || !message.trim()}
            className="submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Help Request
              </>
            )}
          </button>
        </form>

        {/* Librarian Info */}
        <div className="librarian-info">
          <h3>📚 Librarian Information</h3>
          <div className="info-card">
            <p><strong>Name:</strong> NSHIMIYIMANA Yves</p>
            <p><strong>Role:</strong> Head Librarian</p>
            <p><strong>Availability:</strong> Monday - Friday, 9AM - 5PM</p>
            <p className="help-tip">
              💡 Tip: Include as much detail as possible to help the librarian assist you faster.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .help-container {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 20px;
        }

        .help-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
          position: relative;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.05);
        }

        .header-content {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .header-icon {
          min-width: 40px;
        }

        h1 {
          margin: 0;
          font-size: 24px;
        }

        h1 + p {
          margin: 5px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .help-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .quick-issues {
          background: white;
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .quick-issues h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
        }

        .issues-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
        }

        .issue-btn {
          background: #f0f0f0;
          border: 2px solid #e0e0e0;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
        }

        .issue-btn:hover {
          border-color: #667eea;
          background: #f8f8ff;
          transform: translateY(-2px);
        }

        .issue-title {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
          font-size: 13px;
        }

        .issue-desc {
          display: block;
          font-size: 11px;
          color: #777;
        }

        .help-form {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .char-count {
          margin: 5px 0 0 0;
          font-size: 12px;
          color: #999;
        }

        .form-info {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
          color: #1565c0;
          font-size: 13px;
        }

        .form-info svg {
          min-width: 16px;
          margin-top: 2px;
        }

        .error-message {
          background: #ffebee;
          border-left: 4px solid #f44336;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 20px;
          display: flex;
          gap: 10px;
          color: #c62828;
          font-size: 13px;
          align-items: center;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 14px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          font-size: 15px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .librarian-info {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .librarian-info h3 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .info-card {
          background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #667eea;
        }

        .info-card p {
          margin: 8px 0;
          color: #333;
          font-size: 14px;
        }

        .help-tip {
          background: #fffde7;
          padding: 10px;
          border-radius: 4px;
          margin-top: 12px;
          color: #f57f17;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .help-header {
            flex-direction: column;
            text-align: center;
          }

          .issues-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }

          .help-container {
            padding: 10px;
          }

          .quick-issues,
          .help-form,
          .librarian-info {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  )
}
