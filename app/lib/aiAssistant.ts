// AI Assistant for automatic question answering
import { getBooks, getUsers, getTransactions } from './database'

interface AIResponse {
  answer: string
  confidence: number
  source: string
  relatedBooks?: string[]
}

// AI Knowledge base for common questions
const KNOWLEDGE_BASE = {
  borrowing: {
    keywords: ['borrow', 'book', 'checkout', 'loan', 'how to'],
    answers: [
      'To borrow a book: 1) Search for the book in the catalog 2) Click "Borrow" button 3) The book will be added to your "My Books" section 4) You have 14 days to return it.',
      'Each student can borrow up to 5 books at a time. Teachers can borrow up to 10 books.',
      'Books are due 14 days after borrowing. If overdue, you will receive an SMS notification.',
    ],
  },
  returning: {
    keywords: ['return', 'due', 'late', 'overdue'],
    answers: [
      'To return a book: Go to "My Books" tab and click the "Return" button on the book you want to return.',
      'Books are due 14 days from the borrow date. Check the due date in your "My Books" section.',
      'If your book is overdue, the librarian will send you an SMS reminder.',
    ],
  },
  registration: {
    keywords: ['register', 'sign up', 'create', 'account', 'join'],
    answers: [
      'To register: Click "Student/Teacher" → Select your role (Student or Teacher) → Fill in your details → Submit for librarian approval.',
      'Registration requires: Name, Email, Password (minimum 6 characters). Students also need: Class and Phone. Teachers also need: Phone number.',
      'After registration, wait for librarian approval. You will be notified via email once approved.',
    ],
  },
  search: {
    keywords: ['search', 'find', 'look for', 'book', 'author', 'category'],
    answers: [
      'To search for books: Click "Search Books" → Enter title, author, or keyword → Use filters to narrow results by category or author.',
      'You can filter books by: Category (Literature, Science, History, etc.), Author, and Tags.',
      'Use the search bar to find books by title, author name, ISBN, or summary content.',
    ],
  },
  recommendations: {
    keywords: ['recommend', 'suggest', 'interest', 'ai recommendation', 'what should'],
    answers: [
      'AI Recommendations: Click "AI Recommendations" → Select your study interests → The system will suggest books matching your interests.',
      'The AI recommendation system scores books based on: matching tags (+2 points), category match (+1 point), and title relevance (+1 point).',
      'To get better recommendations, update your study interests in your profile.',
    ],
  },
  digital: {
    keywords: ['digital', 'read', 'online', 'pdf', 'ebook'],
    answers: [
      'Digital Library: Click "Digital Library" button to access and read books online without borrowing.',
      'You can read digital books instantly, like your favorite books, and view reading statistics.',
      'Digital books are always available - no need to wait or borrow them.',
    ],
  },
  qa: {
    keywords: ['question', 'ask', 'answer', 'help', 'q&a', 'forum'],
    answers: [
      'Q&A System: Click "Ask Questions" to post a question or answer others\' questions in the community forum.',
      'Librarians are marked with a green badge 📚 when they answer your questions.',
      'Questions are public and help the entire student/teacher community learn together.',
    ],
  },
  profiles: {
    keywords: ['profile', 'my', 'account', 'information', 'edit'],
    answers: [
      'View your profile in the Student Dashboard. Your profile shows: borrowed books, due dates, reading badges, and study interests.',
      'Study interests help the AI recommendation system suggest better books for you.',
      'Reading badges are awarded based on the number of books you borrow: Reader (5 books), Bookworm (10), Voracious (20), Expert (50).',
    ],
  },
  badges: {
    keywords: ['badge', 'achievement', 'reward', 'milestone', 'reading'],
    answers: [
      'Reading Badges: Earn badges as you borrow more books - Reader (5), Bookworm (10), Voracious (20), Expert (50+).',
      'Badges are automatically awarded and displayed in the Search Books view.',
      'Badges encourage reading and celebrate your library journey!',
    ],
  },
  fines: {
    keywords: ['fine', 'fine', 'payment', 'charge', 'fee'],
    answers: [
      'Late fees: Currently, the system tracks overdue books but does not charge fines (feature in development).',
      'Overdue books are marked with a red badge in your "My Books" section.',
      'Return overdue books promptly to maintain good standing with the library.',
    ],
  },
}

export function generateAIResponse(question: string): AIResponse {
  const questionLower = question.toLowerCase()
  let bestMatch: any = null
  let bestScore = 0

  // Search through knowledge base for matching category
  for (const [category, data] of Object.entries(KNOWLEDGE_BASE)) {
    const keywords = data.keywords as string[]
    let score = 0

    for (const keyword of keywords) {
      if (questionLower.includes(keyword)) {
        score += keyword.length // Longer keywords = higher priority
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = { category, data }
    }
  }

  // If match found, return answer
  if (bestMatch && bestScore > 0) {
    const answers = bestMatch.data.answers as string[]
    const answer = answers[Math.floor(Math.random() * answers.length)]

    return {
      answer,
      confidence: Math.min(100, bestScore * 20),
      source: bestMatch.category,
      relatedBooks: getRelatedBooks(bestMatch.category),
    }
  }

  // Fallback if no match found
  return generateDefaultResponse(question)
}

function getRelatedBooks(category: string): string[] {
  const books = getBooks()

  const categoryMapping: Record<string, string[]> = {
    borrowing: ['Fiction', 'General'],
    returning: ['Fiction', 'General'],
    registration: [],
    search: [],
    recommendations: ['Literature', 'Science', 'History'],
    digital: ['Literature', 'Classic'],
    qa: [],
    profiles: [],
    badges: [],
    fines: [],
  }

  const cats = categoryMapping[category] || []
  return books
    .filter(b => cats.includes(b.category))
    .slice(0, 3)
    .map(b => b.title)
}

function generateDefaultResponse(question: string): AIResponse {
  // Extract keywords from question
  const keywords = question.match(/\b[a-z]{4,}\b/gi) || []

  const defaultAnswers: Record<string, string> = {
    book: 'You can search for books using the "Search Books" feature. Browse by title, author, category, or tags.',
    student:
      'As a student, you can borrow books, access AI recommendations, ask questions in the Q&A forum, and read digital books online.',
    teacher:
      'As a teacher, you can borrow books, recommend resources to students, participate in the Q&A forum, and access digital books.',
    library:
      'The library management system allows you to search, borrow, and return books. It also provides AI-powered recommendations and a community Q&A forum.',
  }

  let bestAnswer =
    'I\'m not sure about that. Try asking about: borrowing books, returning books, searching, recommendations, or digital library. You can also ask the librarian directly!'

  for (const [key, answer] of Object.entries(defaultAnswers)) {
    for (const keyword of keywords) {
      if (keyword.toLowerCase() === key.toLowerCase()) {
        bestAnswer = answer
      }
    }
  }

  return {
    answer: bestAnswer,
    confidence: 45,
    source: 'general',
  }
}

// Get contextual info about library
export function getLibraryStats() {
  const books = getBooks()
  const users = getUsers()
  const transactions = getTransactions()

  return {
    totalBooks: books.length,
    totalUsers: users.length,
    activeBorrowings: transactions.filter(t => !t.returnDate).length,
    categories: [...new Set(books.map(b => b.category))],
    mostBorrowedBooks: getMostBorrowedBooks(),
    topUsers: getTopBorrowers(),
  }
}

function getMostBorrowedBooks() {
  const transactions = getTransactions()
  const books = getBooks()
  const bookCount: Record<string, number> = {}

  transactions.forEach(t => {
    bookCount[t.bookId] = (bookCount[t.bookId] || 0) + 1
  })

  return Object.entries(bookCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([bookId, count]) => {
      const book = books.find(b => b.id === bookId)
      return { title: book?.title || 'Unknown', count }
    })
}

function getTopBorrowers() {
  const transactions = getTransactions()
  const users = getUsers()
  const userCount: Record<string, number> = {}

  transactions.forEach(t => {
    userCount[t.memberId] = (userCount[t.memberId] || 0) + 1
  })

  return Object.entries(userCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([userId, count]) => {
      const user = users.find(u => u.id === userId)
      return { name: user?.name || 'Unknown', count }
    })
}

// Answer specific questions with context
export function answerLibraryQuestion(question: string): string {
  const stats = getLibraryStats()

  // How many books questions
  if (
    question.toLowerCase().includes('how many') &&
    question.toLowerCase().includes('book')
  ) {
    return `We have ${stats.totalBooks} books in our library across ${stats.categories.length} categories.`
  }

  // Most borrowed books
  if (
    question.toLowerCase().includes('most') &&
    question.toLowerCase().includes('borrowed')
  ) {
    const mostBorrowed = stats.mostBorrowedBooks[0]
    return `The most borrowed book is "${mostBorrowed.title}" with ${mostBorrowed.count} borrowings. Other popular books: ${stats.mostBorrowedBooks
      .slice(1, 3)
      .map(b => `"${b.title}"`)
      .join(', ')}.`
  }

  // Users/members count
  if (
    question.toLowerCase().includes('how many') &&
    (question.toLowerCase().includes('user') ||
      question.toLowerCase().includes('member'))
  ) {
    return `We have ${stats.totalUsers} registered members in the library system.`
  }

  // Active borrowings
  if (question.toLowerCase().includes('active') && question.toLowerCase().includes('borrow')) {
    return `Currently, there are ${stats.activeBorrowings} active borrowings in the system.`
  }

  // Categories
  if (question.toLowerCase().includes('categor')) {
    return `Our library has books in the following categories: ${stats.categories.join(', ')}.`
  }

  return ''
}
