// Database operations for library management
// In production, this would connect to a real database (PostgreSQL, MongoDB, etc.)

export type UserRole = 'student' | 'teacher' | 'librarian' | 'deputy' | 'guest'
export type RegistrationStatus = 'pending' | 'approved' | 'rejected'
export type StreamCombination = 'MS' | 'LAH' | 'TEC' | 'LFK' | 'HGL' | 'MCE'

// Stream combinations by class
export const STREAM_OPTIONS: Record<string, StreamCombination[]> = {
  'S4': ['MS', 'LAH', 'TEC'], // Maths & Science, Languages & Arts & Humanities, Technical
  'S5': ['LFK', 'HGL', 'MCE'], // LFK, HGL, MCE
  'S6': ['LFK', 'HGL', 'MCE'], // LFK, HGL, MCE
}

export const STREAM_NAMES: Record<StreamCombination, string> = {
  'MS': 'Maths & Science',
  'LAH': 'Languages & Arts & Humanities',
  'TEC': 'Technical',
  'LFK': 'LFK',
  'HGL': 'HGL',
  'MCE': 'MCE',
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone?: string
  role: UserRole
  status: RegistrationStatus
  joinDate: string
  studentId?: string
  cardBarcode?: string
  class?: string // S1 to S6
  stream?: StreamCombination // Class combination/stream (S4, S5, S6)
  interests: string[] // Study interests for AI recommendations
  currentBooks?: string[]
  maxBooks: number
}

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  copies: number
  availableCopies: number
  addedDate: string
  tags: string[] // For matching with interests
  summary?: string
  isDigital?: boolean
  coverColor?: string
}

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  maxBooks: number
  studentId?: string
  cardBarcode?: string
  class?: string // S1 to S6
  currentBooks?: string[]
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  content: string
  timestamp: string
  read: boolean
  type: 'message' | 'reply'
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userClass: string
  content: string
  timestamp: string
  likes: number
  replies: ChatMessage[]
}

export interface Transaction {
  id: string
  bookId: string
  memberId: string
  borrowDate: string
  dueDate: string
  returnDate: string | null
}

export interface Question {
  id: string
  userId: string
  userName: string
  userClass?: string
  title: string
  content: string
  timestamp: string
  answers: Answer[]
  likes: number
}

export interface Answer {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
  isLibrarianAnswer: boolean
  likes: number
}

export interface BookRecommendation {
  id: string
  userId: string
  bookId: string
  matchedInterests: string[]
  score: number
  timestamp: string
}

export function getBooks(): Book[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('books')
  return stored ? JSON.parse(stored) : []
}

export function saveBooks(books: Book[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('books', JSON.stringify(books))
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('users')
  return stored ? JSON.parse(stored) : []
}

export function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('users', JSON.stringify(users))
}

export function getMembers(): Member[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('members')
  return stored ? JSON.parse(stored) : []
}

export function saveMembers(members: Member[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('members', JSON.stringify(members))
}

export function getMessages(): Message[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('messages')
  return stored ? JSON.parse(stored) : []
}

export function saveMessages(messages: Message[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('messages', JSON.stringify(messages))
}

export function getChatMessages(): ChatMessage[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('chatMessages')
  return stored ? JSON.parse(stored) : []
}

export function saveChatMessages(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('chatMessages', JSON.stringify(messages))
}

export function getQuestions(): Question[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('questions')
  return stored ? JSON.parse(stored) : []
}

export function saveQuestions(questions: Question[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('questions', JSON.stringify(questions))
}

export function getRecommendations(): BookRecommendation[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('recommendations')
  return stored ? JSON.parse(stored) : []
}

export function saveRecommendations(recommendations: BookRecommendation[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('recommendations', JSON.stringify(recommendations))
}

export function findMemberByStudentId(studentId: string): Member | undefined {
  const members = getMembers()
  return members.find(m => m.studentId === studentId)
}

export function findMemberByBarcode(barcode: string): Member | undefined {
  const members = getMembers()
  return members.find(m => m.cardBarcode === barcode)
}

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('transactions')
  return stored ? JSON.parse(stored) : []
}

export function saveTransactions(transactions: Transaction[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

export function addBook(book: Omit<Book, 'id'>) {
  const books = getBooks()
  const newBook = {
    ...book,
    id: Date.now().toString(),
  }
  books.push(newBook)
  saveBooks(books)
  return newBook
}

export function addMember(member: Omit<Member, 'id'>) {
  const members = getMembers()
  const newMember = {
    ...member,
    id: Date.now().toString(),
    joinDate: new Date().toISOString(),
  }
  members.push(newMember)
  saveMembers(members)
  return newMember
}

export function borrowBook(bookId: string, memberId: string) {
  const books = getBooks()
  const transactions = getTransactions()
  const users = getUsers()

  const book = books.find(b => b.id === bookId)
  if (!book || book.availableCopies <= 0) {
    throw new Error('Book not available')
  }

  // Check if user already has 1 book borrowed (limit is 1 book per person)
  const userActiveBorrowings = transactions.filter(
    t => t.memberId === memberId && !t.returnDate
  )
  if (userActiveBorrowings.length >= 1) {
    throw new Error('You can only borrow 1 book at a time. Please return your current book first.')
  }

  const member = users.find(u => u.id === memberId)
  if (!member) {
    throw new Error('Member not found')
  }

  book.availableCopies -= 1

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 14) // 2-week loan period

  const transaction = {
    id: Date.now().toString(),
    bookId,
    memberId,
    borrowDate: new Date().toISOString(),
    dueDate: dueDate.toISOString(),
    returnDate: null,
  }

  transactions.push(transaction)
  saveBooks(books)
  saveTransactions(transactions)

  // Send notification to librarian about the borrowing
  if (typeof window !== 'undefined') {
    try {
      const notificationsKey = 'notifications'
      const stored = localStorage.getItem(notificationsKey)
      const allNotifications = stored ? JSON.parse(stored) : []
      
      // Get librarian user
      const librarian = users.find(u => u.role === 'librarian')
      if (librarian) {
        const librarianNotification = {
          id: Date.now().toString(),
          userId: librarian.id,
          type: 'borrow-notification',
          title: 'New Book Borrowed',
          message: `${member.name} borrowed "${book.title}" by ${book.author}. Please monitor and send reminders if needed.`,
          timestamp: new Date().toISOString(),
          read: false,
          bookId,
          borrowedBy: memberId,
          memberName: member.name,
        }
        allNotifications.push(librarianNotification)
        localStorage.setItem(notificationsKey, JSON.stringify(allNotifications))
      }
    } catch (error) {
      console.error('Error sending librarian notification:', error)
    }
  }

  return transaction
}

export function returnBook(transactionId: string) {
  const transactions = getTransactions()
  const books = getBooks()

  const transaction = transactions.find(t => t.id === transactionId)
  if (!transaction) {
    throw new Error('Transaction not found')
  }

  transaction.returnDate = new Date().toISOString()

  const book = books.find(b => b.id === transaction.bookId)
  if (book) {
    book.availableCopies += 1
  }

  saveTransactions(transactions)
  saveBooks(books)

  return transaction
}

// ===== NEW USER AUTHENTICATION & MANAGEMENT FUNCTIONS =====

export function registerUser(user: Omit<User, 'id' | 'joinDate'>) {
  const users = getUsers()
  const existingUser = users.find(u => u.email === user.email)
  if (existingUser) {
    throw new Error('Email already registered')
  }

  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    joinDate: new Date().toISOString(),
    status: user.role === 'librarian' ? 'approved' : 'pending', // Only librarian is auto-approved
  }

  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function loginUser(email: string, password: string): User | null {
  const users = getUsers()
  const user = users.find(u => u.email === email && u.password === password)
  return user && user.status === 'approved' ? user : null
}

export function getUserById(id: string): User | undefined {
  const users = getUsers()
  return users.find(u => u.id === id)
}

export function getPendingRegistrations(): User[] {
  const users = getUsers()
  return users.filter(u => u.status === 'pending' && u.role !== 'librarian')
}

export function approveRegistration(userId: string) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  if (user) {
    user.status = 'approved'
    saveUsers(users)
  }
  return user
}

export function rejectRegistration(userId: string) {
  const users = getUsers()
  const idx = users.findIndex(u => u.id === userId)
  if (idx !== -1) {
    users.splice(idx, 1)
    saveUsers(users)
  }
}

export function updateUserInterests(userId: string, interests: string[]) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  if (user) {
    user.interests = interests
    saveUsers(users)
  }
  return user
}

// ===== AI RECOMMENDATION ENGINE =====

export function generateBookRecommendations(userId: string): Book[] {
  const user = getUserById(userId)
  if (!user || user.interests.length === 0) return []

  const books = getBooks()
  const recommendations: { book: Book; score: number }[] = []

  books.forEach(book => {
    let score = 0
    const tags = book.tags || []
    const category = book.category.toLowerCase()

    // Check for matching interests
    user.interests.forEach(interest => {
      const interestLower = interest.toLowerCase()
      if (tags.some(t => t.toLowerCase().includes(interestLower))) {
        score += 2
      }
      if (category.includes(interestLower)) {
        score += 1
      }
      if (book.title.toLowerCase().includes(interestLower)) {
        score += 1
      }
    })

    if (score > 0) {
      recommendations.push({ book, score })
    }
  })

  // Sort by score and return top 10
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(r => r.book)
}

// ===== Q&A SYSTEM =====

export function addQuestion(question: Omit<Question, 'id' | 'timestamp' | 'answers' | 'likes'>) {
  const questions = getQuestions()
  const newQuestion: Question = {
    ...question,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    answers: [],
    likes: 0,
  }
  questions.push(newQuestion)
  saveQuestions(questions)
  return newQuestion
}

export function addAnswer(questionId: string, answer: Omit<Answer, 'id' | 'timestamp' | 'likes'>) {
  const questions = getQuestions()
  const question = questions.find(q => q.id === questionId)
  if (!question) {
    throw new Error('Question not found')
  }

  const newAnswer: Answer = {
    ...answer,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    likes: 0,
  }

  question.answers.push(newAnswer)
  saveQuestions(questions)
  return newAnswer
}

export function likeQuestion(questionId: string) {
  const questions = getQuestions()
  const question = questions.find(q => q.id === questionId)
  if (question) {
    question.likes += 1
    saveQuestions(questions)
  }
}

export function likeAnswer(questionId: string, answerId: string) {
  const questions = getQuestions()
  const question = questions.find(q => q.id === questionId)
  if (question) {
    const answer = question.answers.find(a => a.id === answerId)
    if (answer) {
      answer.likes += 1
      saveQuestions(questions)
    }
  }
}

// ===== LIBRARIAN EMAIL & NOTIFICATIONS =====

export interface LibrarianSettings {
  id: string
  librarianId: string
  email: string
  enableEmailNotifications: boolean
  notifyOnBorrow: boolean
  notifyOnReturn: boolean
  notifyOnHelpRequest: boolean
}

export function getLibrarianSettings(): LibrarianSettings | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('librarianSettings')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setLibrarianEmail(librarianId: string, email: string): LibrarianSettings {
  if (typeof window === 'undefined') return {} as LibrarianSettings

  const settings: LibrarianSettings = {
    id: Date.now().toString(),
    librarianId,
    email,
    enableEmailNotifications: true,
    notifyOnBorrow: true,
    notifyOnReturn: true,
    notifyOnHelpRequest: true,
  }

  localStorage.setItem('librarianSettings', JSON.stringify(settings))
  
  // Also update the librarian user's email
  const users = getUsers()
  const librarian = users.find(u => u.id === librarianId)
  if (librarian) {
    librarian.email = email
    saveUsers(users)
  }

  return settings
}

export function updateLibrarianNotificationSettings(
  librarianId: string,
  settings: Partial<LibrarianSettings>
): LibrarianSettings {
  if (typeof window === 'undefined') return {} as LibrarianSettings

  let currentSettings = getLibrarianSettings()
  if (!currentSettings) {
    currentSettings = {
      id: Date.now().toString(),
      librarianId,
      email: '',
      enableEmailNotifications: true,
      notifyOnBorrow: true,
      notifyOnReturn: true,
      notifyOnHelpRequest: true,
    }
  }

  const updated = { ...currentSettings, ...settings }
  localStorage.setItem('librarianSettings', JSON.stringify(updated))

  return updated
}
