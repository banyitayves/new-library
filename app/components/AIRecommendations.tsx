'use client'

import { useState } from 'react'
import { Sparkles, BookOpen, Heart } from 'lucide-react'
import { generateBookRecommendations, updateUserInterests } from '@/lib/database'

interface AIRecommendationsProps {
  userId: string
  onBack: () => void
}

const STUDY_INTERESTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Literature',
  'Physics',
  'Chemistry',
  'Biology',
  'Programming',
  'Art',
  'Music',
  'Economics',
  'Philosophy',
  'Psychology',
  'Technology',
  'Social Studies',
  'Languages',
]

export default function AIRecommendations({
  userId,
  onBack,
}: AIRecommendationsProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [likedBooks, setLikedBooks] = useState<string[]>([])

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  const handleGenerateRecommendations = () => {
    if (selectedInterests.length === 0) {
      alert('Please select at least one interest')
      return
    }

    // Save interests
    updateUserInterests(userId, selectedInterests)

    // Generate recommendations
    const recs = generateBookRecommendations(userId)
    setRecommendations(recs)
    setShowRecommendations(true)
  }

  const handleLikeBook = (bookId: string) => {
    setLikedBooks(prev =>
      prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    )
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <button onClick={onBack} className="back-btn">
          ← Back
        </button>
        <div className="header-content">
          <Sparkles size={32} className="header-icon" />
          <h1>AI-Powered Book Recommendations</h1>
          <p>Tell us what you're interested in and we'll recommend the perfect books!</p>
        </div>
      </div>

      <div className="recommendations-content">
        {!showRecommendations ? (
          <div className="interests-section">
            <h2>What are you interested in learning about?</h2>
            <p className="section-subtitle">Select one or more interests and we'll recommend books for you</p>

            <div className="interests-grid">
              {STUDY_INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => handleToggleInterest(interest)}
                  className={`interest-btn ${selectedInterests.includes(interest) ? 'active' : ''}`}
                >
                  <span className="interest-icon">
                    {selectedInterests.includes(interest) ? '✓' : '+'}
                  </span>
                  {interest}
                </button>
              ))}
            </div>

            <div className="selected-interests">
              <h3>Selected ({selectedInterests.length}):</h3>
              <div className="tags-container">
                {selectedInterests.length > 0 ? (
                  selectedInterests.map(interest => (
                    <span key={interest} className="tag">
                      {interest}
                      <button
                        onClick={() => handleToggleInterest(interest)}
                        className="tag-remove"
                      >
                        ×
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="empty-text">Select interests to get started</p>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerateRecommendations}
              className="btn btn-primary"
              disabled={selectedInterests.length === 0}
            >
              <Sparkles size={18} />
              Generate Recommendations
            </button>
          </div>
        ) : (
          <div className="recommendations-section">
            <button
              onClick={() => setShowRecommendations(false)}
              className="btn btn-secondary"
            >
              ← Select Different Interests
            </button>

            <h2>Recommended Books for You</h2>
            <p className="section-subtitle">
              Based on your interests: {selectedInterests.join(', ')}
            </p>

            {recommendations.length > 0 ? (
              <div className="books-grid">
                {recommendations.map(book => (
                  <div key={book.id} className="book-card">
                    <div className="book-cover">
                      <BookOpen size={40} />
                    </div>
                    <h3>{book.title}</h3>
                    <p className="author">by {book.author}</p>
                    <p className="category">{book.category}</p>

                    {book.summary && (
                      <p className="summary">{book.summary.substring(0, 100)}...</p>
                    )}

                    <div className="book-footer">
                      <span className="availability">
                        {book.availableCopies > 0
                          ? `${book.availableCopies} available`
                          : 'Not available'}
                      </span>
                      <button
                        onClick={() => handleLikeBook(book.id)}
                        className={`like-btn ${likedBooks.includes(book.id) ? 'liked' : ''}`}
                      >
                        <Heart
                          size={18}
                          fill={likedBooks.includes(book.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-recommendations">
                <Sparkles size={48} />
                <h3>No books found matching your interests</h3>
                <p>Try different interests or check back later</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .recommendations-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .recommendations-header {
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
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
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

        .recommendations-content {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .interests-section h2,
        .recommendations-section h2 {
          font-size: 24px;
          margin: 0 0 10px;
          color: #333;
        }

        .section-subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
        }

        .interests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 30px;
        }

        .interest-btn {
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }

        .interest-btn:hover {
          border-color: #667eea;
          background: #f0f5ff;
        }

        .interest-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .interest-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          font-size: 12px;
          font-weight: bold;
        }

        .interest-btn.active .interest-icon {
          background: rgba(255, 255, 255, 0.3);
        }

        .selected-interests {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 25px;
        }

        .selected-interests h3 {
          margin: 0 0 12px;
          color: #333;
          font-size: 16px;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .tag {
          background: #667eea;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 13px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .tag-remove {
          background: rgba(255, 255, 255, 0.3);
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
          width: 20px;
          height: 20px;
          padding: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tag-remove:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .empty-text {
          color: #999;
          margin: 0;
          font-size: 13px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
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
          width: 100%;
          justify-content: center;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
          margin-bottom: 20px;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
          transform: translateX(-5px);
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .book-card {
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }

        .book-card:hover {
          border-color: #667eea;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
          transform: translateY(-5px);
        }

        .book-cover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          height: 100px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 12px;
        }

        .book-card h3 {
          margin: 0 0 8px;
          font-size: 16px;
          color: #333;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .author {
          color: #666;
          font-size: 13px;
          margin: 0 0 4px;
        }

        .category {
          color: #999;
          font-size: 12px;
          margin: 0 0 8px;
        }

        .summary {
          color: #777;
          font-size: 12px;
          margin: 8px 0;
          flex: 1;
        }

        .book-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #e0e0e0;
        }

        .availability {
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
        }

        .like-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          color: #999;
          transition: all 0.3s;
        }

        .like-btn:hover,
        .like-btn.liked {
          color: #e74c3c;
          transform: scale(1.2);
        }

        .no-recommendations {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .no-recommendations svg {
          color: #ccc;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-recommendations h3 {
          margin: 0 0 8px;
          color: #333;
        }

        .no-recommendations p {
          margin: 0;
          color: #999;
        }
      `}</style>
    </div>
  )
}
