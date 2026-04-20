'use client'

import { useState } from 'react'
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { registerUser, getUsers, STREAM_OPTIONS, STREAM_NAMES, type StreamCombination } from '@/lib/database'

interface RegisterMembersProps {
  onBack: () => void
  onSuccess?: () => void
}

export default function RegisterMembers({ onBack, onSuccess }: RegisterMembersProps) {
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    class: 'S1',
    stream: '' as StreamCombination | '',
    studentId: '',
    barcode: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [membersList, setMembersList] = useState<any[]>([])

  const classes = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Validation
      if (!formData.name.trim() || !formData.email.trim()) {
        setMessage({ type: 'error', text: 'Name and Email are required' })
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match' })
        setLoading(false)
        return
      }

      if (role === 'student' && !formData.phone) {
        setMessage({ type: 'error', text: 'Phone number is required for students' })
        setLoading(false)
        return
      }

      if (role === 'teacher' && !formData.phone) {
        setMessage({ type: 'error', text: 'Phone number is required for teachers' })
        setLoading(false)
        return
      }

      // Validate stream selection for S4, S5, S6
      if (role === 'student' && (formData.class === 'S4' || formData.class === 'S5' || formData.class === 'S6') && !formData.stream) {
        setMessage({ type: 'error', text: 'Please select class combination/stream for S4, S5, or S6' })
        setLoading(false)
        return
      }

      // Check email uniqueness
      const existingUsers = getUsers()
      if (existingUsers.some(u => u.email === formData.email)) {
        setMessage({ type: 'error', text: 'Email already registered' })
        setLoading(false)
        return
      }

      const newMember = registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        phone: formData.phone,
        class: role === 'student' ? formData.class : undefined,
        stream: role === 'student' && formData.stream ? (formData.stream as StreamCombination) : undefined,
        studentId: role === 'student' ? formData.studentId : undefined,
        barcode: formData.barcode || `BAR-${Math.random().toString(36).substr(2, 10)}`,
        status: 'approved', // Auto-approve for manually added members
      })

      setMessage({ type: 'success', text: `${role === 'student' ? 'Student' : 'Teacher'} "${formData.name}" registered successfully!` })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        class: 'S1',
        stream: '',
        studentId: '',
        barcode: '',
      })

      // Update members list
      setMembersList(getUsers())
      
      onSuccess?.()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>👤 Register New Member</h1>
      </div>

      <div className="register-content">
        <div className="form-section">
          <div className="role-selector">
            <button
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              👨‍🎓 Student
            </button>
            <button
              className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
              onClick={() => setRole('teacher')}
            >
              👨‍🏫 Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            {role === 'student' && (
              <>
                <div className="form-group">
                  <label>Class</label>
                  <select 
                    name="class" 
                    value={formData.class} 
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, class: e.target.value, stream: '' }))
                    }}
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {(formData.class === 'S4' || formData.class === 'S5' || formData.class === 'S6') && (
                  <div className="form-group">
                    <label>Combination/Stream *</label>
                    <select 
                      name="stream" 
                      value={formData.stream} 
                      onChange={(e) => setFormData(prev => ({ ...prev, stream: e.target.value as StreamCombination | '' }))}
                      required
                    >
                      <option value="">-- Select your combination --</option>
                      {STREAM_OPTIONS[formData.class]?.map((stream) => (
                        <option key={stream} value={stream}>
                          {STREAM_NAMES[stream]}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Student ID</label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="e.g., STU-001"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label>Barcode (optional)</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                placeholder="Leave empty for auto-generation"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
              />
            </div>

            {message && (
              <div className={`message ${message.type}`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              <UserPlus size={18} />
              {loading ? 'Registering...' : 'Register Member'}
            </button>
          </form>
        </div>

        {membersList.length > 0 && (
          <div className="recent-members">
            <h2>Recently Added Members</h2>
            <div className="members-list">
              {membersList.slice(-5).map(member => (
                <div key={member.id} className={`member-item ${member.role}`}>
                  <div className="member-icon">
                    {member.role === 'student' ? '👨‍🎓' : '👨‍🏫'}
                  </div>
                  <div className="member-details">
                    <h4>{member.name}</h4>
                    <p>{member.email}</p>
                    {member.class && <p className="class">{member.class}</p>}
                  </div>
                  <div className="member-status">
                    <span className="status approved">✓ Approved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .register-container {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 20px;
        }

        .register-header {
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

        .register-header h1 {
          flex: 1;
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .register-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        @media (max-width: 900px) {
          .register-content {
            grid-template-columns: 1fr;
          }
        }

        .form-section {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .role-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 25px;
        }

        .role-btn {
          padding: 12px;
          border: 2px solid #eee;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }

        .role-btn:hover {
          border-color: #667eea;
        }

        .role-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 2px solid #eee;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .message {
          padding: 12px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
        }

        .message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border-left: 3px solid #4caf50;
        }

        .message.error {
          background: #ffebee;
          color: #d32f2f;
          border-left: 3px solid #f44336;
        }

        .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recent-members {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .recent-members h2 {
          margin: 0 0 20px;
          color: #333;
          font-size: 20px;
        }

        .members-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .member-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          border-left: 3px solid #667eea;
          transition: all 0.3s;
        }

        .member-item.student {
          border-left-color: #2196f3;
        }

        .member-item.teacher {
          border-left-color: #4caf50;
        }

        .member-item:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .member-icon {
          font-size: 24px;
        }

        .member-details {
          flex: 1;
        }

        .member-details h4 {
          margin: 0 0 5px;
          color: #333;
          font-size: 14px;
        }

        .member-details p {
          margin: 3px 0;
          color: #666;
          font-size: 13px;
        }

        .member-details .class {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          display: inline-block;
          font-weight: 600;
          color: #667eea;
        }

        .member-status {
          display: flex;
          gap: 10px;
        }

        .status {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.approved {
          background: #e8f5e9;
          color: #2e7d32;
        }
      `}</style>
    </div>
  )
}
