// AI Assistant for automatic question answering with web search integration
import { getBooks, getUsers, getTransactions } from './database'

interface AIResponse {
  answer: string
  confidence: number
  source: 'library' | 'books' | 'general' | 'web' | 'unknown'
  relatedBooks?: string[]
  webSearchSuggestion?: boolean
}

interface WebSearchResult {
  title: string
  snippet: string
  url: string
}

// AI Knowledge base - Library System Questions
const LIBRARY_KNOWLEDGE_BASE = {
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

// General Knowledge Base for any question (ChatGPT-like)
const GENERAL_KNOWLEDGE_BASE = {
  science: {
    keywords: ['physics', 'chemistry', 'biology', 'science', 'atom', 'cell', 'dna', 'gravity', 'energy'],
    answers: [
      'Physics studies matter, energy, and motion. Chemistry studies reactions between substances. Biology studies living organisms and life processes.',
      'DNA is the molecule that carries genetic instructions for life. All living things have DNA.',
      'Gravity is a force that pulls objects toward each other. The Earth\'s gravity keeps us on the ground.',
      'Energy cannot be created or destroyed - it only changes form (conservation of energy).',
      'Cells are the basic building blocks of all living things. Some organisms have one cell, others have trillions.',
    ],
  },
  history: {
    keywords: ['history', 'war', 'ancient', 'civilization', 'dynasty', 'empire', 'century', 'revolution'],
    answers: [
      'Ancient Egypt lasted about 3,000 years and built famous pyramids around 2500 BCE.',
      'The Roman Empire was one of the largest empires in history, ruling for over 400 years.',
      'World War II lasted from 1939-1945 and involved most of the world\'s nations.',
      'The Industrial Revolution (1760-1840) transformed society through machines and factories.',
      'The Renaissance was a period of cultural awakening in Europe (14th-17th century).',
    ],
  },
  literature: {
    keywords: ['book', 'author', 'novel', 'poem', 'shakespeare', 'tolstoy', 'writing', 'story'],
    answers: [
      'William Shakespeare was an English playwright and poet who lived 1564-1616. He wrote famous plays like Hamlet and Romeo and Juliet.',
      'Jane Austen wrote novels about social issues and love, including Pride and Prejudice.',
      '1984 by George Orwell is a dystopian novel about totalitarianism.',
      'Leo Tolstoy wrote War and Peace, one of the longest and most famous novels ever written.',
      'Poetry is a form of literature that uses rhythm, rhyme, and imagery to express emotions.',
    ],
  },
  technology: {
    keywords: ['computer', 'internet', 'ai', 'technology', 'programming', 'software', 'code', 'digital'],
    answers: [
      'Artificial Intelligence (AI) is technology that can learn and make decisions like humans.',
      'The internet connects millions of computers worldwide through networks and protocols.',
      'Programming is writing instructions for computers to follow using code.',
      'Python, JavaScript, and Java are popular programming languages.',
      'Cloud computing stores data and runs programs on internet servers instead of local computers.',
    ],
  },
  mathematics: {
    keywords: ['math', 'number', 'algebra', 'geometry', 'equation', 'calculate', 'square', 'triangle'],
    answers: [
      'Algebra uses letters and symbols to represent unknown numbers in equations.',
      'Geometry studies shapes, sizes, and space. A triangle has 3 sides and 3 angles.',
      'Pi (π) is approximately 3.14159. It\'s the ratio of a circle\'s circumference to its diameter.',
      'Pythagorean theorem: In a right triangle, a² + b² = c² (where c is the longest side).',
      'Prime numbers are only divisible by 1 and themselves. Examples: 2, 3, 5, 7, 11, 13.',
    ],
  },
  geography: {
    keywords: ['geography', 'country', 'city', 'continent', 'ocean', 'mountain', 'climate', 'map'],
    answers: [
      'Earth has 7 continents: Africa, Antarctica, Asia, Europe, North America, Oceania, South America.',
      'The Pacific Ocean is the largest ocean on Earth.',
      'Mount Everest is the tallest mountain at 8,848 meters (29,029 feet).',
      'The equator is an imaginary line dividing Earth into Northern and Southern hemispheres.',
      'Climate refers to long-term weather patterns. Deserts are hot and dry, rainforests are hot and wet.',
    ],
  },
  economics: {
    keywords: ['economy', 'money', 'business', 'market', 'price', 'supply', 'demand', 'trade'],
    answers: [
      'Supply and demand determine prices. When demand is high and supply is low, prices increase.',
      'GDP (Gross Domestic Product) measures the total value of goods and services a country produces.',
      'Inflation is when prices rise over time, reducing the purchasing power of money.',
      'A free market economy is based on supply, demand, and competition.',
      'Import is buying goods from another country. Export is selling goods to another country.',
    ],
  },
  health: {
    keywords: ['health', 'medicine', 'disease', 'doctor', 'exercise', 'diet', 'nutrition', 'vaccine'],
    answers: [
      'A balanced diet includes proteins, carbohydrates, fats, vitamins, and minerals.',
      'Regular exercise strengthens the heart, builds muscle, and improves mental health.',
      'Vaccines help your body build immunity to diseases before you get them.',
      'The heart pumps blood throughout your body to deliver oxygen and nutrients.',
      'Sleep is important for memory, emotional regulation, and physical health. Most adults need 7-9 hours.',
    ],
  },
  art: {
    keywords: ['art', 'painting', 'sculpture', 'artist', 'color', 'music', 'dance', 'creativity'],
    answers: [
      'Primary colors are red, yellow, and blue. Mixing them creates secondary colors.',
      'Leonardo da Vinci was an Italian Renaissance artist famous for the Mona Lisa.',
      'Michelangelo sculpted famous works like David and painted the Sistine Chapel ceiling.',
      'Music uses notes, rhythm, and harmony to create emotional experiences.',
      'Dance is movement performed to music, expressing stories and emotions.',
    ],
  },
  philosophy: {
    keywords: ['philosophy', 'ethics', 'logic', 'think', 'reason', 'meaning', 'truth', 'belief'],
    answers: [
      'Philosophy comes from Greek words meaning "love of wisdom" - it explores fundamental questions about life.',
      'Ethics is the study of right and wrong behavior.',
      'Logic is the study of correct reasoning and arguments.',
      'Socrates, Plato, and Aristotle were ancient Greek philosophers who influenced Western thought.',
      'Existentialism suggests people have freedom and responsibility to create their own meaning in life.',
    ],
  },
  environment: {
    keywords: ['climate', 'environment', 'pollution', 'green', 'solar', 'renewable', 'carbon', 'ecosystem'],
    answers: [
      'Climate change is caused mainly by greenhouse gases like carbon dioxide from burning fossil fuels.',
      'Renewable energy sources include solar, wind, hydroelectric, and geothermal power.',
      'Recycling reduces waste and conserves natural resources.',
      'An ecosystem is a community of living organisms and their physical environment.',
      'Deforestation removes trees, which decreases oxygen production and increases carbon dioxide.',
    ],
  },
  sports: {
    keywords: ['sport', 'soccer', 'basketball', 'tennis', 'football', 'game', 'team', 'player'],
    answers: [
      'Soccer (football) is played with 11 players per team using a ball.',
      'Basketball has 5 players per team and is played on a court with hoops at each end.',
      'Tennis is played with 2 (singles) or 4 (doubles) players hitting a ball over a net.',
      'American football has teams of 11 players trying to move the ball down the field.',
      'The Olympic Games are international sporting competitions held every 4 years.',
    ],
  },
}

export function generateAIResponse(question: string): AIResponse {
  const questionLower = question.toLowerCase()

  // 1. First, check if it's about the library
  const libraryMatch = searchKnowledgeBase(questionLower, LIBRARY_KNOWLEDGE_BASE)
  if (libraryMatch) {
    return {
      answer: libraryMatch.answer,
      confidence: libraryMatch.confidence,
      source: 'library',
      relatedBooks: getRelatedBooks(libraryMatch.category),
    }
  }

  // 2. Search the books in the system for relevant content
  const bookMatch = searchBooksInSystem(questionLower)
  if (bookMatch) {
    return bookMatch
  }

  // 3. Check general knowledge base
  const generalMatch = searchKnowledgeBase(questionLower, GENERAL_KNOWLEDGE_BASE)
  if (generalMatch) {
    return {
      answer: generalMatch.answer,
      confidence: generalMatch.confidence,
      source: 'general',
    }
  }

  // 4. Suggest web search for unknown topics
  return generateWebSearchSuggestion(question)
}

function searchKnowledgeBase(
  question: string,
  knowledgeBase: Record<string, { keywords: string[]; answers: string[] }>
): { answer: string; confidence: number; category: string } | null {
  let bestMatch: any = null
  let bestScore = 0

  for (const [category, data] of Object.entries(knowledgeBase)) {
    const keywords = data.keywords as string[]
    let score = 0

    for (const keyword of keywords) {
      if (question.includes(keyword)) {
        score += keyword.length
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = { category, data }
    }
  }

  if (bestMatch && bestScore > 0) {
    const answers = bestMatch.data.answers as string[]
    const answer = answers[Math.floor(Math.random() * answers.length)]

    return {
      answer,
      confidence: Math.min(100, bestScore * 15),
      category: bestMatch.category,
    }
  }

  return null
}

// Search books in the system for matching content
function searchBooksInSystem(question: string): AIResponse | null {
  const books = getBooks()
  const words = question.split(' ').filter(w => w.length > 3)

  let relevantBooks: any[] = []

  for (const book of books) {
    let score = 0
    const bookContent = (
      book.title +
      ' ' +
      book.author +
      ' ' +
      book.category +
      ' ' +
      book.tags.join(' ') +
      ' ' +
      book.summary
    ).toLowerCase()

    for (const word of words) {
      if (bookContent.includes(word)) {
        score += 1
      }
    }

    if (score > 0) {
      relevantBooks.push({ book, score })
    }
  }

  if (relevantBooks.length > 0) {
    relevantBooks.sort((a, b) => b.score - a.score)
    const topBooks = relevantBooks.slice(0, 3)

    const bookTitles = topBooks.map(b => b.book.title)
    const authors = topBooks.map(b => b.book.author).join(', ')

    const answer =
      `I found ${topBooks.length} book(s) in our library that might help: ${bookTitles.join(', ')} by ${authors}. ` +
      `You can borrow these books to learn more about "${question.replace(/[?!.]/g, '')}"!`

    return {
      answer,
      confidence: Math.min(95, topBooks[0].score * 30),
      source: 'books',
      relatedBooks: bookTitles,
    }
  }

  return null
}

// Web search framework and suggestion
function generateWebSearchSuggestion(question: string): AIResponse {
  const answer =
    `I don't have enough information about "${question}" in my current knowledge base. ` +
    `However, I can help you in these ways:\n\n` +
    `1. 📚 Search our library books - I can find related books on this topic\n` +
    `2. 🔍 Ask the librarian or teachers - They have expert knowledge\n` +
    `3. 🌐 Suggest a web search - You can search online for more details\n\n` +
    `Would you like me to search our library books for related topics instead?`

  return {
    answer,
    confidence: 50,
    source: 'unknown',
    webSearchSuggestion: true,
  }
}

function getRelatedBooks(category: string): string[] {
  const books = getBooks()

  const categoryMapping: Record<string, string[]> = {
    borrowing: ['Fiction', 'General', 'Literature'],
    returning: ['Fiction', 'General'],
    registration: [],
    search: [],
    recommendations: ['Literature', 'Science', 'History'],
    digital: ['Literature', 'General'],
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

// WEB SEARCH INTEGRATION FRAMEWORK
// This framework can be integrated with Google Custom Search, Bing API, or other search engines

export async function performWebSearch(query: string): Promise<WebSearchResult[]> {
  try {
    // Framework for Google Custom Search API
    const googleSearchResponse = await callGoogleCustomSearch(query)
    if (googleSearchResponse) {
      return googleSearchResponse
    }

    // Framework for Bing Search API (backup)
    const bingSearchResponse = await callBingSearch(query)
    if (bingSearchResponse) {
      return bingSearchResponse
    }

    // If no real API is configured, return suggested keywords for local search
    return generateLocalSearchSuggestions(query)
  } catch (error) {
    console.error('Web search error:', error)
    return generateLocalSearchSuggestions(query)
  }
}

// Google Custom Search Integration (Framework Ready)
async function callGoogleCustomSearch(query: string): Promise<WebSearchResult[] | null> {
  // TODO: Configure with your Google API key and Search Engine ID
  // const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  // const SEARCH_ENGINE_ID = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID

  // Example implementation:
  // const response = await fetch(
  //   `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}`
  // )
  // const data = await response.json()
  // return data.items.map(item => ({
  //   title: item.title,
  //   snippet: item.snippet,
  //   url: item.link
  // }))

  return null // Not configured yet
}

// Bing Search API Integration (Framework Ready)
async function callBingSearch(query: string): Promise<WebSearchResult[] | null> {
  // TODO: Configure with your Bing Search API key
  // const BING_API_KEY = process.env.NEXT_PUBLIC_BING_SEARCH_API_KEY

  // Example implementation:
  // const response = await fetch(
  //   `https://api.bing.microsoft.com/v7.0/search?q=${query}`,
  //   { headers: { 'Ocp-Apim-Subscription-Key': BING_API_KEY } }
  // )
  // const data = await response.json()
  // return data.webPages.value.map(item => ({
  //   title: item.name,
  //   snippet: item.snippet,
  //   url: item.url
  // }))

  return null // Not configured yet
}

// Generate local search suggestions when web APIs are not available
function generateLocalSearchSuggestions(query: string): WebSearchResult[] {
  const suggestions: WebSearchResult[] = [
    {
      title: `Search "${query}" on Google`,
      snippet:
        'Google is the most popular search engine for general information and questions.',
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    },
    {
      title: `Search "${query}" on Wikipedia`,
      snippet: 'Wikipedia provides comprehensive information on a wide range of topics.',
      url: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`,
    },
    {
      title: `Search "${query}" on YouTube`,
      snippet: 'YouTube has educational videos on almost any topic.',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    },
  ]

  return suggestions
}

// Enhanced response generator with web search results
export function generateResponseWithWebSearch(
  question: string,
  webResults: WebSearchResult[]
): AIResponse {
  if (webResults.length === 0) {
    return generateWebSearchSuggestion(question)
  }

  const topResult = webResults[0]
  const answer =
    `I found information online about "${question}":\n\n` +
    `📌 **${topResult.title}**\n` +
    `${topResult.snippet}\n\n` +
    `🔗 More results are available online. Here are some suggested searches:\n` +
    webResults
      .map((r, i) => `${i + 1}. [${r.title}](${r.url})`)
      .join('\n')

  return {
    answer,
    confidence: 65,
    source: 'web',
  }
}

