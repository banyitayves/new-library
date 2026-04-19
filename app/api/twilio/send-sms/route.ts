import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message, type } = await request.json()

    // Validate required fields
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    // Log the SMS notification
    const notification = {
      id: Date.now(),
      type: type || 'general',
      phoneNumber,
      message,
      messageId: result.sid,
      status: result.status,
      sentAt: new Date().toISOString(),
    }

    // In a production app, you'd store this in a database
    console.log('SMS notification sent:', notification)

    return NextResponse.json(
      {
        success: true,
        notification,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending SMS:', error)
    return NextResponse.json(
      { error: 'Failed to send SMS' },
      { status: 500 }
    )
  }
}
