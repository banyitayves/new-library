# GS Busanza Library Management System

A modern, full-stack Next.js application for managing the GS Busanza School library with React components and Twilio SMS automation.

## Features

✨ **Core Features:**
- 📚 Book Management (Add, edit, search, delete)
- 👥 Member Management (Register, manage, track)
- 📤 Loan Transactions (Borrow, return, due dates)
- 🔔 SMS Notifications with Twilio
  - Due date reminders for overdue books
  - New book notifications
  - Event notifications

💻 **Technology Stack:**
- **Frontend:** React 18, Next.js 14, TypeScript
- **Backend:** Next.js API Routes
- **SMS:** Twilio
- **State Management:** React Hooks
- **Styling:** CSS Grid & Flexbox

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Twilio Account (for SMS features)

### Installation

1. Navigate to the project:
```bash
cd gs-busanza-library
```

2. Install dependencies:
```bash
npm install
```

3. Configure Twilio credentials in `.env.local`:
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
NEXT_PUBLIC_SCHOOL_NAME=GS Busanza
NEXT_PUBLIC_SCHOOL_CODE=GSB-2024
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Project Structure

```
gs-busanza-library/
├── app/
│   ├── api/
│   │   ├── twilio/
│   │   │   ├── send-sms/        # Manual SMS sending
│   │   │   └── check-due-books/  # Automatic due reminders
│   ├── components/               # React components
│   │   ├── Dashboard.tsx
│   │   ├── AuthModal.tsx
│   │   ├── BooksSection.tsx
│   │   ├── MembersSection.tsx
│   │   ├── TransactionsSection.tsx
│   │   └── NotificationsSection.tsx
│   ├── lib/
│   │   ├── database.ts          # Data management
│   │   └── smsNotifications.ts  # Twilio integration
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
│   └── manifest.json
├── package.json
├── tsconfig.json
└── next.config.js
```

## Usage

### Login
- Demo account available
- New users can register with email and phone number

### Send SMS Notifications
1. Go to Notifications section
2. Enter member's phone number
3. Choose notification type
4. Send message via Twilio

### Automatic Due Reminders
- Click "Check & Send Reminders" button
- Automatically sends SMS to members with overdue books
- Can be scheduled with cron jobs

## API Endpoints

### POST /api/twilio/send-sms
Send a manual SMS message
```json
{
  "phoneNumber": "+250XXXXXXXXX",
  "message": "Your message here",
  "type": "general|due-reminder|new-book|event"
}
```

### GET /api/twilio/check-due-books
Check for due books and send reminders
- No parameters required
- Returns count of reminders sent

## Development

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Build & Deploy
```bash
npm run build
npm start
```

## Security Notes
- Never commit `.env.local` with real credentials
- Use environment variables for sensitive data
- Validate all inputs server-side
- Implement authentication properly in production

## Future Enhancements
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication with NextAuth.js
- [ ] Advanced analytics & reporting
- [ ] Reading challenges & gamification
- [ ] QR code scanning
- [ ] Mobile app
- [ ] Email notifications
- [ ] Integration with school ERP systems

## License
MIT

## Support
For support, contact the GS Busanza school administration.
