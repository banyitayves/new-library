'use client'

import { useState } from 'react'
import { Mail, Lock, Phone, User } from 'lucide-react'

interface AuthModalProps {
  onLogin: (user: any) => void
}

export default function AuthModal({ onLogin }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState('login')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginData.email && loginData.password) {
      const user = {
        id: Date.now().toString(),
        email: loginData.email,
        name: loginData.email.split('@')[0],
        type: 'member',
      }
      onLogin(user)
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (registerData.email && registerData.password && registerData.name) {
      const user = {
        id: Date.now().toString(),
        email: registerData.email,
        phone: registerData.phone,
        name: registerData.name,
        type: 'member',
      }
      onLogin(user)
    }
  }

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <div className="auth-header">
          <h1>📚 GS Busanza Library</h1>
          <p>School Library Management System</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
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
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-group">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Your name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
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
                  placeholder="your@email.com"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-group">
                <Phone size={18} />
                <input
                  type="tel"
                  placeholder="+250XXX000000"
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, phone: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Create password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
