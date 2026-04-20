'use client'

import { Clock, Mail, AlertCircle } from 'lucide-react'

interface PendingApprovalProps {
  userName: string
  userEmail: string
  userRole: string
  onLogout: () => void
}

export default function PendingApproval({
  userName,
  userEmail,
  userRole,
  onLogout,
}: PendingApprovalProps) {
  return (
    <div className="pending-container">
      <div className="pending-card">
        <div className="pending-header">
          <Clock size={60} className="pending-icon" />
          <h1>Registration Pending</h1>
        </div>

        <div className="pending-content">
          <p className="welcome-message">
            Welcome, <strong>{userName}</strong>! 👋
          </p>

          <div className="info-box">
            <AlertCircle size={24} />
            <div>
              <h3>Your registration is under review</h3>
              <p>
                The librarian will review your registration request and approve or reject it.
                This usually takes 1-2 hours.
              </p>
            </div>
          </div>

          <div className="details-box">
            <div className="detail-item">
              <span className="label">Name:</span>
              <span className="value">{userName}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{userEmail}</span>
            </div>
            <div className="detail-item">
              <span className="label">Role:</span>
              <span className="value">{userRole === 'student' ? '👨‍🎓 Student' : '👨‍🏫 Teacher'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value status-pending">⏳ Pending Approval</span>
            </div>
          </div>

          <div className="notification-box">
            <Mail size={20} />
            <p>
              You will receive an email notification at <strong>{userEmail}</strong> once your
              account is approved by the librarian.
            </p>
          </div>

          <div className="tips-box">
            <h4>What happens next?</h4>
            <ol>
              <li>The librarian reviews your registration details</li>
              <li>They verify you are a legitimate student or teacher</li>
              <li>Your account gets approved and you receive an email</li>
              <li>You can then log in and start borrowing books!</li>
            </ol>
          </div>
        </div>

        <button onClick={onLogout} className="btn btn-secondary">
          Logout & Try Again Later
        </button>
      </div>

      <style jsx>{`
        .pending-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .pending-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          padding: 40px;
        }

        .pending-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .pending-icon {
          color: #ff9800;
          margin-bottom: 15px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .pending-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 10px 0 0;
          color: #333;
        }

        .pending-content {
          margin-bottom: 30px;
        }

        .welcome-message {
          text-align: center;
          font-size: 18px;
          color: #667eea;
          margin-bottom: 25px;
          font-weight: 600;
        }

        .info-box {
          background: #fff8f0;
          border-left: 4px solid #ff9800;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          display: flex;
          gap: 15px;
        }

        .info-box svg {
          color: #ff9800;
          flex-shrink: 0;
        }

        .info-box h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 16px;
        }

        .info-box p {
          margin: 0;
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }

        .details-box {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-item .label {
          font-weight: 600;
          color: #333;
        }

        .detail-item .value {
          color: #666;
        }

        .status-pending {
          color: #ff9800;
          font-weight: 600;
        }

        .notification-box {
          background: #e3f2fd;
          border-left: 4px solid #2196f3;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
          display: flex;
          gap: 15px;
        }

        .notification-box svg {
          color: #2196f3;
          flex-shrink: 0;
        }

        .notification-box p {
          margin: 0;
          color: #333;
          font-size: 14px;
          line-height: 1.6;
        }

        .tips-box {
          background: #f0f8ff;
          border-left: 4px solid #2196f3;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .tips-box h4 {
          margin: 0 0 12px 0;
          color: #333;
          font-size: 15px;
        }

        .tips-box ol {
          margin: 0;
          padding-left: 20px;
          color: #666;
          font-size: 14px;
          line-height: 1.8;
        }

        .tips-box li {
          margin-bottom: 8px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
