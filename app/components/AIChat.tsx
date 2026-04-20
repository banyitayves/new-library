'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, Sparkles, X, Loader } from 'lucide-react'
import { generateAIResponse, answerLibraryQuestion } from '@/lib/aiAssistant'

interface AIChatProps {
  onClose?: () => void
  embedded?: boolean
}

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  confidence?: number
  source?: string
}

export default function AIChat({ onClose, embedded = false }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'ai',
      content: '👋 Welcome! I\'m the AI Assistant for the library. Ask me anything about borrowing books, searching, recommendations, or how to use the system. I\'m here to help!',
      timestamp: new Date(),
      confidence: 100,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Simulate AI processing delay
    setTimeout(() => {
      // First check if it's a contextual library question
      const contextualAnswer = answerLibraryQuestion(input)

      let aiResponse: ChatMessage

      if (contextualAnswer) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: contextualAnswer,
          timestamp: new Date(),
          confidence: 95,
          source: 'library-stats',
        }
      } else {
        // Generate AI response
        const response = generateAIResponse(input)

        aiResponse = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: response.answer,
          timestamp: new Date(),
          confidence: response.confidence,
          source: response.source,
        }
      }

      setMessages(prev => [...prev, aiResponse])
      setLoading(false)
    }, 800)
  }

  const suggestionQuestions = [
    'How do I borrow a book?',
    'How can I search for books?',
    'What is AI Recommendations?',
    'How do reading badges work?',
    'Can I read books online?',
    'How do I register?',
  ]

  const handleSuggestion = (question: string) => {
    setInput(question)
  }

  if (!embedded) {
    return (
      <div className="ai-chat-container">
        <div className="chat-header">
          <div className="header-content">
            <Sparkles size={28} className="header-icon" />
            <div>
              <h1>🤖 AI Library Assistant</h1>
              <p>Ask me anything about the library</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="close-btn">
              <X size={24} />
            </button>
          )}
        </div>

        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.role}`}>
              <div className="message-icon">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <p className="message-text">{msg.content}</p>
                {msg.role === 'ai' && msg.confidence && (
                  <div className="message-meta">
                    <span className="confidence">
                      Confidence: {Math.round(msg.confidence)}%
                    </span>
                    {msg.source && (
                      <span className="source">Source: {msg.source}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div className="message-icon">🤖</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            <p className="suggestions-title">Try asking:</p>
            <div className="suggestions-grid">
              {suggestionQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestion(q)}
                  className="suggestion-btn"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about the library..."
            className="chat-input"
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} className="send-btn">
            {loading ? <Loader size={20} className="spinner" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    )
  }

  // Embedded version (widget)
  return (
    <div className="ai-chat-embedded">
      <div className="chat-messages-compact">
        {messages.slice(-3).map(msg => (
          <div key={msg.id} className={`message-compact ${msg.role}`}>
            <span className="icon">{msg.role === 'user' ? '👤' : '🤖'}</span>
            <p>{msg.content.substring(0, 60)}...</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="chat-input-compact">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask..."
          className="input-compact"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          <Send size={16} />
        </button>
      </form>

      <style jsx>{`
        .ai-chat-embedded {
          background: white;
          border-radius: 8px;
          padding: 10px;
          max-height: 300px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .chat-messages-compact {
          flex: 1;
          overflow-y: auto;
          font-size: 12px;
        }

        .message-compact {
          padding: 6px;
          margin: 4px 0;
          border-radius: 4px;
          display: flex;
          gap: 6px;
        }

        .message-compact.user {
          background: #f0f0f0;
          text-align: right;
        }

        .message-compact.ai {
          background: #e3f2fd;
        }

        .message-compact .icon {
          font-size: 14px;
        }

        .message-compact p {
          margin: 0;
          flex: 1;
        }

        .chat-input-compact {
          display: flex;
          gap: 6px;
        }

        .input-compact {
          flex: 1;
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 12px;
        }

        .chat-input-compact button {
          padding: 6px 10px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export const styles = `
  .ai-chat-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f7fa;
    display: flex;
    flex-direction: column;
    z-index: 1000;
  }

  .chat-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .header-icon {
    flex-shrink: 0;
  }

  .chat-header h1 {
    margin: 0 0 5px;
    font-size: 24px;
  }

  .chat-header p {
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
  }

  .close-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .message {
    display: flex;
    gap: 12px;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.user .message-icon {
    order: 2;
  }

  .message.user .message-content {
    order: 1;
  }

  .message-icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  .message-content {
    max-width: 70%;
    padding: 12px 16px;
    border-radius: 10px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .message.user .message-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .message-text {
    margin: 0;
    line-height: 1.5;
    font-size: 14px;
  }

  .message-meta {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    gap: 12px;
    font-size: 11px;
    opacity: 0.7;
  }

  .message.user .message-meta {
    border-color: rgba(255, 255, 255, 0.2);
  }

  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 8px 0;
  }

  .typing-indicator span {
    width: 8px;
    height: 8px;
    background: #667eea;
    border-radius: 50%;
    animation: typing 1.4s infinite;
  }

  .typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%,
    60%,
    100% {
      opacity: 0.3;
      transform: translateY(0);
    }
    30% {
      opacity: 1;
      transform: translateY(-10px);
    }
  }

  .suggestions {
    padding: 20px;
    border-top: 1px solid #eee;
  }

  .suggestions-title {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }

  .suggestions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 8px;
  }

  .suggestion-btn {
    padding: 10px;
    background: #f0f0f0;
    border: 2px solid #eee;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    transition: all 0.3s;
  }

  .suggestion-btn:hover {
    border-color: #667eea;
    color: #667eea;
    background: white;
  }

  .chat-input-form {
    display: flex;
    gap: 10px;
    padding: 15px 20px;
    background: white;
    border-top: 2px solid #eee;
  }

  .chat-input {
    flex: 1;
    padding: 12px;
    border: 2px solid #eee;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s;
  }

  .chat-input:focus {
    outline: none;
    border-color: #667eea;
  }

  .send-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: all 0.3s;
  }

  .send-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  .send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .message-content {
      max-width: 85%;
    }

    .suggestions-grid {
      grid-template-columns: 1fr;
    }

    .chat-header {
      padding: 15px;
    }

    .header-content {
      gap: 10px;
    }

    .chat-header h1 {
      font-size: 18px;
    }
  }
`
