import axios from 'axios'

interface DueBook {
  bookId: string
  bookTitle: string
  memberId: string
  memberName: string
  memberPhone: string
  dueDate: string
  daysOverdue: number
}

export async function checkDueBooks(): Promise<DueBook[]> {
  try {
    // This would typically fetch from your database
    // For now, we'll get from localStorage via a backend call
    const member = localStorage.getItem('currentMember')
    if (!member) return []

    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
    const books = JSON.parse(localStorage.getItem('books') || '[]')

    const now = new Date()
    const dueBooks: DueBook[] = []

    transactions.forEach((tx: any) => {
      if (tx.returnDate === null) {
        const dueDate = new Date(tx.dueDate)
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysOverdue > 0) {
          const book = books.find((b: any) => b.id === tx.bookId)
          dueBooks.push({
            bookId: tx.bookId,
            bookTitle: book?.title || 'Unknown',
            memberId: tx.memberId,
            memberName: member.name || 'Member',
            memberPhone: member.phone || '',
            dueDate: tx.dueDate,
            daysOverdue,
          })
        }
      }
    })

    return dueBooks
  } catch (error) {
    console.error('Error checking due books:', error)
    return []
  }
}

export async function sendDueReminders(dueBooks: DueBook[]) {
  const results = []

  for (const book of dueBooks) {
    const message = `Hi ${book.memberName}, your book "${book.bookTitle}" is ${book.daysOverdue} day(s) overdue. Please return it to GS Busanza School Library.`

    try {
      const response = await axios.post('/api/twilio/send-sms', {
        phoneNumber: book.memberPhone,
        message,
        type: 'due-reminder',
      })

      results.push({
        memberId: book.memberId,
        status: 'sent',
        response,
      })
    } catch (error) {
      console.error(`Failed to send reminder to ${book.memberPhone}:`, error)
      results.push({
        memberId: book.memberId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  return results
}

export async function sendNewBookNotification(book: any, memberPhones: string[]) {
  const message = `New book at GS Busanza Library: "${book.title}" by ${book.author}. Check it out! 📚`

  const results = []

  for (const phone of memberPhones) {
    try {
      const response = await axios.post('/api/twilio/send-sms', {
        phoneNumber: phone,
        message,
        type: 'new-book',
      })

      results.push({
        phone,
        status: 'sent',
      })
    } catch (error) {
      console.error(`Failed to send new book notification to ${phone}:`, error)
      results.push({
        phone,
        status: 'failed',
      })
    }
  }

  return results
}

export async function sendEventNotification(event: any, memberPhones: string[]) {
  const message = `Event at GS Busanza: ${event.name}. ${event.description}. Join us! 🎉`

  const results = []

  for (const phone of memberPhones) {
    try {
      const response = await axios.post('/api/twilio/send-sms', {
        phoneNumber: phone,
        message,
        type: 'event-notification',
      })

      results.push({
        phone,
        status: 'sent',
      })
    } catch (error) {
      console.error(`Failed to send event notification to ${phone}:`, error)
      results.push({
        phone,
        status: 'failed',
      })
    }
  }

  return results
}
