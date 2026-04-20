// Enhanced features for the library system
// Digital Resources, Gamification, Notifications, CSV Import

export interface DigitalResource {
  id: string
  title: string
  author: string
  type: 'ebook' | 'audiobook' | 'journal'
  url: string
  category: string
  coverUrl?: string
  dateAdded: string
}

export interface UserBadge {
  id: string
  userId: string
  badgeType: 'reader' | 'scholar' | 'bookworm' | 'voracious' | 'expert'
  title: string
  description: string
  icon: string
  earnedDate: string
}

export interface Notification {
  id: string
  userId: string
  type: 'due-date' | 'overdue' | 'reservation' | 'fine' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  bookId?: string
}

// CSV Import/Export functions
export function parseCSVMembers(csvContent: string): any[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const members = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    
    const values = lines[i].split(',').map(v => v.trim())
    const member: any = {}

    headers.forEach((header, index) => {
      member[header] = values[index] || ''
    })

    if (member.name && member.email) {
      members.push({
        id: Date.now().toString() + Math.random(),
        name: member.name,
        email: member.email,
        phone: member.phone || '',
        studentId: member.studentid || `GSB-${Math.floor(Math.random() * 10000)}`,
        class: member.class || 'S1',
        joinDate: new Date().toISOString(),
        maxBooks: 5,
        cardBarcode: member.barcode || `BC-${Math.random().toString(36).substr(2, 9)}`,
      })
    }
  }

  return members
}

export function parseCSVBooks(csvContent: string): any[] {
  const lines = csvContent.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const books = []

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    
    const values = lines[i].split(',').map(v => v.trim())
    const book: any = {}

    headers.forEach((header, index) => {
      book[header] = values[index] || ''
    })

    if (book.title && book.author) {
      books.push({
        id: Date.now().toString() + Math.random(),
        title: book.title,
        author: book.author,
        isbn: book.isbn || `ISBN-${Math.random().toString(36).substr(2, 10)}`,
        category: book.category || 'General',
        copies: parseInt(book.copies) || 1,
        availableCopies: parseInt(book.copies) || 1,
        addedDate: new Date().toISOString(),
        tags: (book.tags || '').split(';').filter((t: string) => t.trim()),
        summary: book.summary || '',
      })
    }
  }

  return books
}

export function generateCSVSampleMembers(): string {
  return `name,email,phone,studentId,class,barcode
John Doe,john@example.com,+256701234567,GSB-001,S1,BC-123456
Jane Smith,jane@example.com,+256702345678,GSB-002,S2,BC-234567
Bob Johnson,bob@example.com,+256703456789,GSB-003,S3,BC-345678
Alice Williams,alice@example.com,+256704567890,GSB-004,S4,BC-456789
David Brown,david@example.com,+256705678901,GSB-005,S5,BC-567890`
}

export function generateCSVSampleBooks(): string {
  return `title,author,isbn,category,copies,tags,summary
The Great Gatsby,F. Scott Fitzgerald,978-0743273565,Literature,3,"classic;fiction;20th-century",A classic American novel set in the Jazz Age
To Kill a Mockingbird,Harper Lee,978-0061120084,Literature,2,"classic;coming-of-age;social-issues",A gripping tale of race and morality in the American South
1984,George Orwell,978-0451524935,Dystopian,4,"dystopian;science-fiction;political",A chilling vision of totalitarianism
The Hobbit,J.R.R. Tolkien,978-0547928227,Fantasy,5,"fantasy;adventure;classic","An epic fantasy journey through Middle-earth"
Pride and Prejudice,Jane Austen,978-0141439518,Romance,3,"romance;classic;19th-century",A witty exploration of love and marriage`
}

export function getDigitalResources(): DigitalResource[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('digitalResources')
  return stored ? JSON.parse(stored) : []
}

export function saveDigitalResources(resources: DigitalResource[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('digitalResources', JSON.stringify(resources))
}

export function getUserBadges(userId: string): UserBadge[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('userBadges')
  const allBadges = stored ? JSON.parse(stored) : []
  return allBadges.filter((b: UserBadge) => b.userId === userId)
}

export function addUserBadge(badge: Omit<UserBadge, 'id' | 'earnedDate'>): UserBadge {
  const badges = getAllBadges()
  const newBadge: UserBadge = {
    ...badge,
    id: Date.now().toString(),
    earnedDate: new Date().toISOString(),
  }
  badges.push(newBadge)
  saveAllBadges(badges)
  return newBadge
}

export function getAllBadges(): UserBadge[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('userBadges')
  return stored ? JSON.parse(stored) : []
}

export function saveAllBadges(badges: UserBadge[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('userBadges', JSON.stringify(badges))
}

export function getNotifications(userId: string): Notification[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('notifications')
  const allNotifications = stored ? JSON.parse(stored) : []
  return allNotifications.filter((n: Notification) => n.userId === userId).sort((a: Notification, b: Notification) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}

export function addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): Notification {
  const notifications = getAllNotifications()
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  }
  notifications.push(newNotification)
  saveAllNotifications(notifications)
  return newNotification
}

export function getAllNotifications(): Notification[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('notifications')
  return stored ? JSON.parse(stored) : []
}

export function saveAllNotifications(notifications: Notification[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem('notifications', JSON.stringify(notifications))
}

export function markNotificationAsRead(notificationId: string) {
  const notifications = getAllNotifications()
  const notification = notifications.find(n => n.id === notificationId)
  if (notification) {
    notification.read = true
    saveAllNotifications(notifications)
  }
}

// Check reading milestones and award badges
export function checkReadingBadges(userId: string, transactionCount: number) {
  const badges = getAllBadges()
  const userBadges = badges.filter(b => b.userId === userId)

  if (transactionCount >= 5 && !userBadges.find(b => b.badgeType === 'reader')) {
    addUserBadge({
      userId,
      badgeType: 'reader',
      title: '📖 Reader',
      description: 'Borrowed 5 books',
      icon: '📖',
    })
  }

  if (transactionCount >= 10 && !userBadges.find(b => b.badgeType === 'bookworm')) {
    addUserBadge({
      userId,
      badgeType: 'bookworm',
      title: '🐛 Bookworm',
      description: 'Borrowed 10 books',
      icon: '🐛',
    })
  }

  if (transactionCount >= 20 && !userBadges.find(b => b.badgeType === 'voracious')) {
    addUserBadge({
      userId,
      badgeType: 'voracious',
      title: '🔥 Voracious Reader',
      description: 'Borrowed 20 books',
      icon: '🔥',
    })
  }

  if (transactionCount >= 50 && !userBadges.find(b => b.badgeType === 'expert')) {
    addUserBadge({
      userId,
      badgeType: 'expert',
      title: '⭐ Knowledge Expert',
      description: 'Borrowed 50 books',
      icon: '⭐',
    })
  }
}

export function searchBooks(query: string, books: any[], filters?: {author?: string, category?: string, dateFrom?: string}): any[] {
  let results = books

  // Text search
  if (query.trim()) {
    const q = query.toLowerCase()
    results = results.filter(b => 
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q) ||
      b.summary?.toLowerCase().includes(q) ||
      b.tags?.some((t: string) => t.toLowerCase().includes(q))
    )
  }

  // Faceted filters
  if (filters?.author) {
    results = results.filter(b => b.author.toLowerCase() === filters.author?.toLowerCase())
  }

  if (filters?.category) {
    results = results.filter(b => b.category.toLowerCase() === filters.category?.toLowerCase())
  }

  if (filters?.dateFrom) {
    results = results.filter(b => new Date(b.addedDate) >= new Date(filters.dateFrom!))
  }

  return results
}

export function searchUsers(query: string, users: any[]): any[] {
  if (!query.trim()) return users
  
  const q = query.toLowerCase()
  return users.filter(u => 
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q) ||
    u.studentId?.toLowerCase().includes(q) ||
    u.class?.includes(q.toUpperCase())
  )
}
