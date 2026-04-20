'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, ThumbsUp, Plus } from 'lucide-react'
import {
  getQuestions,
  addQuestion,
  addAnswer,
  likeQuestion,
  likeAnswer,
  getUserById,
} from '@/lib/database'

interface QASystemProps {
  userId: string
  userName: string
  userRole: string
  onBack: () => void
}

export default function QASystem({
  userId,
  userName,
  userRole,
  onBack,
}: QASystemProps) {
  const [questions, setQuestions] = useState<any[]>([])
  const [showNewQuestion, setShowNewQuestion] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form states
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionContent, setQuestionContent] = useState('')
  const [answerContent, setAnswerContent] = useState('')

  useEffect(() => {
    setQuestions(getQuestions())
  }, [])

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!questionTitle.trim() || !questionContent.trim()) {
      alert('Please fill in both title and content')
      return
    }

    const newQuestion = addQuestion({
      userId,
      userName,
      userClass: getUserById(userId)?.class,
      title: questionTitle,
      content: questionContent,
    })

    setQuestions([newQuestion, ...questions])
    setQuestionTitle('')
    setQuestionContent('')
    setShowNewQuestion(false)
  }

  const handleAddAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerContent.trim() || !selectedQuestion) {
      alert('Please write an answer')
      return
    }

    const updatedQuestion = addAnswer(selectedQuestion.id, {
      userId,
      userName,
      content: answerContent,
      isLibrarianAnswer: userRole === 'librarian',
    })

    setSelectedQuestion(updatedQuestion)
    setQuestions(questions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q)))
    setAnswerContent('')
  }

  const handleLikeQuestion = (questionId: string) => {
    likeQuestion(questionId)
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? { ...q, likes: q.likes + 1 } : q
    )
    setQuestions(updatedQuestions)
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion({ ...selectedQuestion, likes: selectedQuestion.likes + 1 })
    }
  }

  const handleLikeAnswer = (answerId: string) => {
    if (!selectedQuestion) return
    likeAnswer(selectedQuestion.id, answerId)
    const updatedQuestion = {
      ...selectedQuestion,
      answers: selectedQuestion.answers.map((a: any) =>
        a.id === answerId ? { ...a, likes: a.likes + 1 } : a
      ),
    }
    setSelectedQuestion(updatedQuestion)
    setQuestions(questions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q)))
  }

  const filteredQuestions = questions.filter(
    q =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="qa-container">
      <div className="qa-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <div className="header-content">
          <MessageCircle size={32} className="header-icon" />
          <h1>Q&A Community</h1>
          <p>Ask questions and get answers from the librarian and other students</p>
        </div>
      </div>

      <div className="qa-content">
        {!selectedQuestion ? (
          <div className="questions-list-section">
            <div className="list-header">
              <div>
                <h2>Questions & Discussions</h2>
                <p className="section-subtitle">
                  {filteredQuestions.length} questions in total
                </p>
              </div>
              <button
                onClick={() => setShowNewQuestion(!showNewQuestion)}
                className="btn btn-primary"
              >
                <Plus size={18} />
                New Question
              </button>
            </div>

            {showNewQuestion && (
              <form onSubmit={handleAddQuestion} className="new-question-form">
                <h3>Ask a Question</h3>
                <div className="form-group">
                  <label>Question Title</label>
                  <input
                    type="text"
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    placeholder="What's your question?"
                    maxLength={100}
                  />
                </div>
                <div className="form-group">
                  <label>Details</label>
                  <textarea
                    value={questionContent}
                    onChange={(e) => setQuestionContent(e.target.value)}
                    placeholder="Provide more details about your question..."
                    rows={4}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <Send size={16} />
                    Post Question
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewQuestion(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="questions-list">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestion(q)}
                    className="question-item"
                  >
                    <div className="question-main">
                      <h4>{q.title}</h4>
                      <p>{q.content.substring(0, 100)}...</p>
                      <div className="question-meta">
                        <span className="author">
                          Asked by <strong>{q.userName}</strong>
                        </span>
                        {q.userClass && <span className="class">{q.userClass}</span>}
                        <span className="time">
                          {new Date(q.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="question-stats">
                      <span className="stat">
                        <MessageCircle size={16} />
                        {q.answers.length}
                      </span>
                      <span className="stat">
                        <ThumbsUp size={16} />
                        {q.likes}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <MessageCircle size={48} />
                  <h3>No questions found</h3>
                  <p>Be the first to ask a question!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="question-detail-section">
            <button
              onClick={() => setSelectedQuestion(null)}
              className="back-btn"
            >
              ← Back to Questions
            </button>

            <div className="question-detail">
              <div className="detail-header">
                <h2>{selectedQuestion.title}</h2>
                <button
                  onClick={() => handleLikeQuestion(selectedQuestion.id)}
                  className="like-btn"
                >
                  <ThumbsUp size={18} />
                  {selectedQuestion.likes}
                </button>
              </div>

              <div className="detail-meta">
                <span>
                  Asked by <strong>{selectedQuestion.userName}</strong>
                </span>
                {selectedQuestion.userClass && (
                  <span>{selectedQuestion.userClass}</span>
                )}
                <span>{new Date(selectedQuestion.timestamp).toLocaleString()}</span>
              </div>

              <div className="detail-content">
                <p>{selectedQuestion.content}</p>
              </div>
            </div>

            <div className="answers-section">
              <h3>
                Answers ({selectedQuestion.answers.length})
              </h3>

              <form onSubmit={handleAddAnswer} className="answer-form">
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Write your answer here..."
                  rows={3}
                />
                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  Post Answer
                </button>
              </form>

              <div className="answers-list">
                {selectedQuestion.answers.length > 0 ? (
                  selectedQuestion.answers.map((answer: any) => (
                    <div
                      key={answer.id}
                      className={`answer-item ${answer.isLibrarianAnswer ? 'librarian' : ''}`}
                    >
                      <div className="answer-header">
                        <div>
                          <strong>{answer.userName}</strong>
                          {answer.isLibrarianAnswer && (
                            <span className="librarian-badge">📚 Librarian</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleLikeAnswer(answer.id)}
                          className="like-btn"
                        >
                          <ThumbsUp size={16} />
                          {answer.likes}
                        </button>
                      </div>
                      <p className="answer-content">{answer.content}</p>
                      <span className="time">
                        {new Date(answer.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="no-answers">No answers yet. Be the first to answer!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .qa-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .qa-header {
          max-width: 1200px;
          margin: 0 auto 30px;
        }

        .back-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid white;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 20px;
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-5px);
        }

        .header-content {
          text-align: center;
          color: white;
        }

        .header-icon {
          margin-bottom: 15px;
        }

        .header-content h1 {
          font-size: 32px;
          margin: 10px 0 8px;
          font-weight: 700;
        }

        .header-content p {
          font-size: 16px;
          opacity: 0.9;
        }

        .qa-content {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }

        .list-header h2 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #333;
        }

        .section-subtitle {
          color: #666;
          font-size: 14px;
          margin: 0;
        }

        .new-question-form {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .new-question-form h3 {
          margin: 0 0 15px;
          color: #333;
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 10px;
        }

        .search-bar {
          margin-bottom: 25px;
        }

        .search-bar input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-bar input:focus {
          outline: none;
          border-color: #667eea;
        }

        .questions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .question-item {
          background: #f9f9f9;
          padding: 16px;
          border-radius: 8px;
          border: 2px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          text-align: left;
        }

        .question-item:hover {
          border-color: #667eea;
          background: #f5f5ff;
        }

        .question-main {
          flex: 1;
        }

        .question-item h4 {
          margin: 0 0 8px;
          color: #333;
          font-size: 16px;
        }

        .question-item p {
          margin: 0 0 8px;
          color: #666;
          font-size: 13px;
        }

        .question-meta {
          display: flex;
          gap: 12px;
          font-size: 12px;
          color: #999;
        }

        .author {
          color: #667eea;
        }

        .class {
          background: #f0f5ff;
          padding: 2px 6px;
          border-radius: 3px;
          color: #667eea;
        }

        .question-stats {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #999;
          font-size: 13px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .empty-state svg {
          opacity: 0.3;
          margin-bottom: 15px;
        }

        .empty-state h3 {
          margin: 0 0 8px;
          color: #666;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        .question-detail {
          background: #f9f9f9;
          padding: 25px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .detail-header h2 {
          margin: 0;
          color: #333;
          font-size: 22px;
        }

        .detail-meta {
          display: flex;
          gap: 15px;
          font-size: 13px;
          color: #999;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
        }

        .detail-content {
          color: #666;
          line-height: 1.8;
        }

        .answers-section {
          margin-top: 30px;
        }

        .answers-section h3 {
          margin: 0 0 20px;
          color: #333;
          font-size: 18px;
        }

        .answer-form {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .answer-form textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-family: inherit;
          font-size: 14px;
          margin-bottom: 10px;
          resize: vertical;
        }

        .answer-form textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .answers-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .answer-item {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #e0e0e0;
          transition: all 0.3s;
        }

        .answer-item.librarian {
          border-left-color: #4caf50;
          background: #f1f8f4;
        }

        .answer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .librarian-badge {
          background: #4caf50;
          color: white;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 11px;
          margin-left: 8px;
          font-weight: 600;
        }

        .answer-content {
          margin: 10px 0;
          color: #666;
          line-height: 1.6;
        }

        .answer-item .time {
          font-size: 12px;
          color: #999;
        }

        .like-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          transition: all 0.3s;
        }

        .like-btn:hover {
          color: #e74c3c;
        }

        .no-answers {
          text-align: center;
          color: #999;
          padding: 30px;
          font-size: 14px;
        }

        .btn {
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #e0e0e0;
          color: #333;
        }

        .btn-secondary:hover {
          background: #d0d0d0;
        }
      `}</style>
    </div>
  )
}
