// Database operations for library management
// In production, this would connect to a real database (PostgreSQL, MongoDB, etc.)

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  copies: number
  availableCopies: number
  addedDate: string
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

export function getBooks(): Book[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('books')
  return stored ? JSON.parse(stored) : []
}

export function saveBooks(books: Book[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('books', JSON.stringify(books))
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

  const book = books.find(b => b.id === bookId)
  if (!book || book.availableCopies <= 0) {
    throw new Error('Book not available')
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
