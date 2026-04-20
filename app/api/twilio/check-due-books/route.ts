import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { checkDueBooks, sendDueReminders } from '@/lib/smsNotifications'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // This endpoint should be called by a scheduled job (e.g., cron)
    const dueBooks = await checkDueBooks()
    
    if (dueBooks.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No due books found',
        count: 0,
      })
    }

    const results = await sendDueReminders(dueBooks)

    return NextResponse.json({
      success: true,
      message: `Sent ${results.length} due reminders`,
      count: results.length,
      results,
    })
  } catch (error) {
    console.error('Error checking due books:', error)
    return NextResponse.json(
      { error: 'Failed to check due books' },
      { status: 500 }
    )
  }
}
