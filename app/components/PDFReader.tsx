'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Download, Eye, X } from 'lucide-react'

interface PDFReaderProps {
  book: any
  onClose: () => void
}

export default function PDFReader({ book, onClose }: PDFReaderProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Simulated PDF content - in production, use a real PDF library like react-pdf
  const getSampleContent = () => {
    const sampleTexts: Record<string, string[]> = {
      'The Great Gatsby': [
        'THE GREAT GATSBY - Chapter 1\n\nIn my younger and more vulnerable years my father gave me advice that I\'ve been turning over in my mind ever since.\n\n"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven\'t had the advantages that you\'ve had."\n\nHe didn\'t say any more, but we\'ve always been unusually communicative in a reserved way...',
        'Chapter 1 continues...\n\nThe Buchanans—that was the impression I got—were careless people... they smashed up things and creatures and then retreated into their money or their vast carelessness, and let other people clean up the mess they had made.',
        'The Party\n\nInside the crimson drawing-room they sat down to dinner. The champagne was served in glasses as tall as a man.\n\n"What\'ll we do with ourselves this afternoon?" cried Daisy, "and the day after that, and the next thirty years?"',
      ],
      'To Kill a Mockingbird': [
        'To Kill a Mockingbird - Chapter 1\n\nWhen he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem\'s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury.\n\nThe shadow of a huge elm tree...',
        'Scout\'s Observations\n\nMaycomb was an old town, but it was a tired old town when I first knew it. In rainy weather the streets turned to red slop... nothing to do after dark but talk to each other on porches.',
        'Atticus Finch\n\nOur father didn\'t do anything. He worked in an office, not in a drugstore. Atticus didn\'t play poker or fish or drink or smoke. He sat in the living room and read.',
      ],
      '1984': [
        '1984 - Part One\n\nIt was a bright cold day in April, and the clocks were striking thirteen.\n\nWinston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.',
        'The Telescreen\n\nThe party told you to reject the evidence of your eyes and ears. It was their final, most essential command.\n\nWinston kept his back turned to the telescreen. It was safer; though, as he well knew, even a back could be revealing.',
        'The Ministry\n\nThe Ministry of Peace concerns itself with war. The Ministry of Truth with lies. The Ministry of Love with torture. The Ministry of Plenty with starvation.',
      ],
      'The Hobbit': [
        'The Hobbit - In a Hole in the Ground\n\nIn a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat...',
        'Bilbo\'s Home\n\nBilbo Baggins\' home was a perfect hobbit-hole. It was a hole, and that meant comfort. It had a round green door, a polished brass knob, and a brass mailbox.',
        'The Dwarves Arrive\n\nThere came a loud knock! Bilbo jumped. The knock came again. "Wait, I\'m coming!" he called, running to the door. He opened it and to his surprise, in stepped a tall old man with a tall pointed blue hat.',
      ],
      'Pride and Prejudice': [
        'Pride and Prejudice - Opening\n\nIt is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families...',
        'The Bennets\n\nThe business of Mrs. Bennet\'s life was to get her daughters married; its solace was visiting and news.\n\nShe was a woman of mean understanding, little information, and uncertain temper...',
        'Elizabeth\'s Character\n\nElizabeth was the most lively, playful, and witty of the Bennet girls. She had the talent of seeing the ridiculous side of matters and could not restrain her laughter.',
      ],
    }

    return sampleTexts[book.title] || [
      `${book.title} - Page 1\n\n${book.summary || 'No content available'}\n\nThis is a digital preview of the book.`,
      `${book.title} - Page 2\n\nAuthor: ${book.author}\n\nCategory: ${book.category}\n\nTags: ${book.tags?.join(', ') || 'No tags'}`,
    ]
  }

  useEffect(() => {
    const content = getSampleContent()
    setTotalPages(content.length)
    setIsLoading(false)
  }, [book])

  const content = getSampleContent()
  const pageContent = content[currentPage - 1] || ''

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleDownload = () => {
    alert(`📥 Download feature: Would download "${book.title}" PDF\n\nIn production, this would download the actual PDF file.`)
  }

  return (
    <div className="pdf-overlay">
      <div className="pdf-container">
        <div className="pdf-header">
          <div className="pdf-title">
            <h2>{book.title}</h2>
            <p>{book.author}</p>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="pdf-content">
          <div className="pdf-page">
            <pre className="page-text">{pageContent}</pre>
          </div>
        </div>

        <div className="pdf-footer">
          <div className="navigation">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="nav-btn"
            >
              <ChevronLeft size={20} /> Previous
            </button>

            <div className="page-info">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>

            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="nav-btn"
            >
              Next <ChevronRight size={20} />
            </button>
          </div>

          <div className="actions">
            <button onClick={handleDownload} className="action-btn">
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>

        <div className="pdf-info">
          <div className="info-item">
            <strong>Category:</strong> {book.category}
          </div>
          <div className="info-item">
            <strong>Tags:</strong> {book.tags?.join(', ') || 'N/A'}
          </div>
          <div className="info-item">
            <strong>Summary:</strong> {book.summary || 'No description available'}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pdf-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .pdf-container {
          background: white;
          border-radius: 10px;
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .pdf-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 2px solid #eee;
        }

        .pdf-title h2 {
          margin: 0 0 5px;
          color: #333;
          font-size: 22px;
        }

        .pdf-title p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          transition: color 0.3s;
          padding: 5px;
        }

        .close-btn:hover {
          color: #333;
        }

        .pdf-content {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
          background: #f9f9f9;
        }

        .pdf-page {
          background: white;
          padding: 30px;
          border-radius: 5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          min-height: 400px;
        }

        .page-text {
          margin: 0;
          font-family: 'Georgia', serif;
          font-size: 14px;
          line-height: 1.8;
          color: #333;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .pdf-footer {
          padding: 20px;
          border-top: 2px solid #eee;
          background: #f9f9f9;
        }

        .navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 15px;
        }

        .nav-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .nav-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .action-btn {
          background: #f0f0f0;
          border: 2px solid #ddd;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .action-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .pdf-info {
          padding: 15px 20px;
          background: #f5f5f5;
          border-top: 1px solid #eee;
          font-size: 13px;
        }

        .info-item {
          padding: 8px 0;
          color: #666;
        }

        .info-item strong {
          color: #333;
          margin-right: 8px;
        }

        @media (max-width: 768px) {
          .pdf-overlay {
            padding: 10px;
          }

          .pdf-container {
            max-height: 95vh;
          }

          .pdf-page {
            padding: 15px;
          }

          .page-text {
            font-size: 12px;
          }

          .navigation {
            gap: 10px;
          }

          .nav-btn {
            padding: 8px 15px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  )
}
