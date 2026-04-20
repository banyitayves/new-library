'use client'

import { useState } from 'react'
import { Mail, Lock, User, Phone, BookOpen, LogIn, UserPlus } from 'lucide-react'
import { registerUser, loginUser } from '@/lib/database'

interface LoginRegisterProps {
  onLoginSuccess: (user: any) => void
  onGuestMode: () => void
}

export default function LoginRegister({ onLoginSuccess, onGuestMode }: LoginRegisterProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Login form
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student')
  const [regClass, setRegClass] = useState('S1')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const user = loginUser(loginEmail, loginPassword)
      if (user) {
        onLoginSuccess(user)
      } else {
        setError('Invalid email/password or registration pending approval')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    try {
      if (regPassword !== regConfirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      if (regPassword.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }

      const newUser = registerUser({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        role: regRole,
        class: regRole === 'student' ? regClass : undefined,
        interests: [],
        maxBooks: 1,
        status: 'pending',
      })

      setSuccessMessage(
        'Registration submitted! Please wait for librarian approval. You will receive an email when approved.'
      )
      setRegName('')
      setRegEmail('')
      setRegPassword('')
      setRegConfirmPassword('')
      setRegPhone('')
      setTimeout(() => setMode('login'), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <BookOpen size={40} className="auth-icon" />
          <h1>GS Busanza Library</h1>
          <p>Manage Books, Grow Knowledge</p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Student/Teacher Login</h2>

            <div className="form-group">
              <label>Email</label>
              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your.email@school.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="auth-divider">OR</div>

            <button
              type="button"
              onClick={onGuestMode}
              className="btn btn-secondary"
            >
              Continue as Guest
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="link-button"
              >
                Register here
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <h2>Student/Teacher Registration</h2>

            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as 'student' | 'teacher')}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>

              {regRole === 'student' && (
                <div className="form-group">
                  <label>Class</label>
                  <select value={regClass} onChange={(e) => setRegClass(e.target.value)}>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S4">S4</option>
                    <option value="S5">S5</option>
                    <option value="S6">S6</option>
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <div className="input-group">
                <User size={18} />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="your.email@school.com"
                  required
                />
              </div>
            </div>

            {regRole === 'teacher' && (
              <div className="form-group">
                <label>Phone</label>
                <div className="input-group">
                  <Phone size={18} />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+1234567890"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              <UserPlus size={18} />
              {loading ? 'Registering...' : 'Register'}
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="link-button"
              >
                Login here
              </button>
            </p>
          </form>
        )}
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .auth-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          padding: 40px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-icon {
          color: #667eea;
          margin-bottom: 15px;
        }

        .auth-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 10px 0 5px;
          color: #333;
        }

        .auth-header p {
          color: #666;
          font-size: 14px;
        }

        .auth-form h2 {
          font-size: 22px;
          margin-bottom: 25px;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 12px;
          transition: all 0.3s;
        }

        .input-group:focus-within {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .input-group input,
        .form-group select {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
          font-size: 14px;
        }

        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .form-group select:focus {
          border-color: #667eea;
          outline: none;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 15px;
          transition: all 0.3s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
          margin-top: 0;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 14px;
          border-left: 4px solid #c00;
        }

        .success-message {
          background: #efe;
          color: #060;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 14px;
          border-left: 4px solid #060;
        }

        .auth-divider {
          text-align: center;
          margin: 20px 0;
          color: #999;
          font-size: 14px;
          position: relative;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 45%;
          height: 1px;
          background: #e0e0e0;
        }

        .auth-divider::before {
          left: 0;
        }

        .auth-divider::after {
          right: 0;
        }

        .auth-switch {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 14px;
        }

        .link-button {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          text-decoration: underline;
          font-weight: 600;
          padding: 0;
        }

        .link-button:hover {
          color: #764ba2;
        }
      `}</style>
    </div>
  )
}
