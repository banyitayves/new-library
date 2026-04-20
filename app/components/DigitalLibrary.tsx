'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Eye, Download, Share2, Heart, MessageCircle } from 'lucide-react'
import PDFReader from './PDFReader'
import { getBooks } from '@/lib/database'

interface DigitalLibraryProps {
  onNavigate?: (mode: string) => void
}

const SAMPLE_DIGITAL_BOOKS = [
  {
    id: 'pdf-001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Literature',
    tags: ['classic', 'fiction', '20th-century'],
    summary: 'A masterpiece of American literature, set in the Jazz Age. The story follows Nick Carraway as he becomes involved in the world of the mysterious millionaire Jay Gatsby.',
    coverColor: '#FFB6C1',
    isDigital: true,
  },
  {
    id: 'pdf-002',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Literature',
    tags: ['classic', 'drama', 'coming-of-age'],
    summary: 'Through the innocent eyes of a young girl named Scout, Harper Lee explores the complexities of morality and racism in the American South.',
    coverColor: '#87CEEB',
    isDigital: true,
  },
  {
    id: 'pdf-003',
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    tags: ['dystopia', 'science-fiction', 'political'],
    summary: 'A haunting novel of totalitarianism and surveillance set in a nightmare world of perpetual war and pervasive government control.',
    coverColor: '#DC143C',
    isDigital: true,
  },
  {
    id: 'pdf-004',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    tags: ['adventure', 'fantasy', 'classic'],
    summary: 'Bilbo Baggins, a respectable hobbit, is whisked away on an unexpected adventure with a group of dwarves seeking to reclaim their treasure.',
    coverColor: '#DAA520',
    isDigital: true,
  },
  {
    id: 'pdf-005',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    tags: ['classic', 'romance', 'period-drama'],
    summary: 'Elizabeth Bennet navigates love, family, and societal expectations in this witty and romantic tale of personal growth and true love.',
    coverColor: '#FF69B4',
    isDigital: true,
  },
  {
    id: 'pdf-006',
    title: 'Mine Boy',
    author: 'Peter Abrahams',
    category: 'African Literature',
    tags: ['african', 'fiction', 'contemporary', 'coming-of-age'],
    summary: 'A powerful story of a young man from the rural areas of South Africa who comes to the city to find work in the mines. Through his journey, the novel explores themes of identity, class struggle, and the human spirit against oppression.',
    coverColor: '#8B4513',
    isDigital: true,
  },
]

export default function DigitalLibrary({ onNavigate }: DigitalLibraryProps) {
  const [books, setBooks] = useState<any[]>([])
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [likedBooks, setLikedBooks] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

  useEffect(() => {
    // Initialize digital books on first load
    initializeDigitalBooks()
    loadLikedBooks()
  }, [])

  const initializeDigitalBooks = () => {
    const existingBooks = getBooks()
    
    // Check if digital books already exist
    const hasDigitalBooks = existingBooks.some(b => b.isDigital === true)
    
    if (!hasDigitalBooks) {
      // Add digital books to the library
      const allBooks = [
        ...existingBooks,
        ...SAMPLE_DIGITAL_BOOKS.map(book => ({
          ...book,
          id: `digital-${Math.random().toString(36).substr(2, 9)}`,
          copies: 999,
          availableCopies: 999,
          isbn: `ISBN-${Math.random().toString(36).substr(2, 10)}`,
          addedDate: new Date().toISOString(),
        }))
      ]
      
      // Save to localStorage via the getBooks mechanism
      if (typeof window !== 'undefined') {
        localStorage.setItem('books', JSON.stringify(allBooks))
      }
    }
    
    const allBooks = getBooks()
    setBooks(allBooks.filter(b => b.isDigital === true))
  }

  const loadLikedBooks = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('likedDigitalBooks')
      if (stored) {
        setLikedBooks(JSON.parse(stored))
      }
    }
  }

  const toggleLike = (bookId: string) => {
    const updated = likedBooks.includes(bookId)
      ? likedBooks.filter(id => id !== bookId)
      : [...likedBooks, bookId]
    
    setLikedBooks(updated)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedDigitalBooks', JSON.stringify(updated))
    }
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || book.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...new Set(books.map(b => b.category))]

  return (
    <div className="digital-library">
      {selectedBook && (
        <PDFReader book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      <div className="library-header">
        <div className="header-content">
          <BookOpen size={32} className="header-icon" />
          <div>
            <h1>📚 Digital Library - Read Books Online</h1>
            <p>Access {books.length} digital books and enjoy reading instantly</p>
          </div>
        </div>
      </div>

      <div className="library-filters">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-box"
        />

        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="books-grid">
        {filteredBooks.length === 0 ? (
          <div className="no-results">
            <BookOpen size={48} />
            <h3>No books found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-cover" style={{ backgroundColor: book.coverColor }}>
                <div className="cover-content">
                  <BookOpen size={48} />
                  <p className="cover-title">{book.title}</p>
                </div>
              </div>

              <div className="book-details">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-category">{book.category}</p>

                <div className="book-tags">
                  {book.tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="book-actions">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="action-btn primary"
                  >
                    <Eye size={16} /> Read Now
                  </button>

                  <button
                    onClick={() => toggleLike(book.id)}
                    className={`action-btn ${likedBooks.includes(book.id) ? 'liked' : ''}`}
                  >
                    <Heart size={16} fill={likedBooks.includes(book.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="book-stats">
                  <span className="stat">
                    <Eye size={14} /> {Math.floor(Math.random() * 500) + 100} reads
                  </span>
                  <span className="stat">
                    <Heart size={14} /> {Math.floor(Math.random() * 200) + 50} likes
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .digital-library {
          min-height: 100vh;
          background: #f5f7fa;
          padding: 20px;
        }

        .library-header {
          max-width: 1200px;
          margin: 0 auto 30px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          flex-shrink: 0;
        }

        .library-header h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .library-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }

        .library-filters {
          max-width: 1200px;
          margin: 0 auto 30px;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .search-box {
          width: 100%;
          padding: 12px;
          border: 2px solid #eee;
          border-radius: 6px;
          font-size: 14px;
          margin-bottom: 15px;
          transition: border-color 0.3s;
        }

        .search-box:focus {
          outline: none;
          border-color: #667eea;
        }

        .category-filter {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 2px solid #eee;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .filter-btn:hover {
          border-color: #667eea;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .books-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 20px;
          color: #999;
        }

        .no-results svg {
          opacity: 0.3;
          margin-bottom: 15px;
        }

        .book-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }

        .book-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          transform: translateY(-5px);
        }

        .book-cover {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .book-cover::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
        }

        .cover-content {
          position: relative;
          z-index: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .cover-title {
          margin: 0;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;
        }

        .book-details {
          flex: 1;
          padding: 15px;
          display: flex;
          flex-direction: column;
        }

        .book-title {
          margin: 0 0 5px;
          font-size: 16px;
          color: #333;
          font-weight: 700;
          line-height: 1.3;
        }

        .book-author {
          margin: 0 0 3px;
          font-size: 13px;
          color: #666;
        }

        .book-category {
          margin: 0 0 10px;
          font-size: 12px;
          color: #667eea;
          font-weight: 600;
        }

        .book-tags {
          display: flex;
          gap: 6px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .tag {
          background: #f0f0f0;
          padding: 3px 8px;
          border-radius: 3px;
          font-size: 11px;
          color: #666;
        }

        .book-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;
        }

        .action-btn {
          flex: 1;
          padding: 8px;
          border: 2px solid #eee;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.3s;
        }

        .action-btn:hover {
          border-color: #667eea;
          color: #667eea;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
          flex: 2;
        }

        .action-btn.primary:hover {
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .action-btn.liked {
          color: #e74c3c;
        }

        .book-stats {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 768px) {
          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
          }

          .book-cover {
            height: 150px;
          }

          .library-header {
            padding: 20px;
          }

          .library-header h1 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}
