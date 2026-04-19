# Kiosk Mode Features - Complete Guide

## 🖥️ Overview

Your GS Busanza Library system now includes a **Self-Service Kiosk Mode** - a simplified, dedicated interface designed for library computers where students can independently manage their library activities.

---

## ✨ Features

### 1. **Two Access Modes**
When you open the application, you see a main menu with two options:

#### 🎓 **Student Kiosk**
- Simplified interface for students
- Login with Student ID or card barcode
- Borrow books, view current loans
- Message librarian staff
- Community chat with peers

#### 📊 **Librarian Dashboard**
- Full admin access
- Manage books, members, transactions
- View statistics
- Configure library settings

---

## 🔐 Student Login Methods

### Method 1: Student ID Login
1. Click "Student Kiosk"
2. Select "Student ID" tab
3. Enter Student ID (format: `GSB-001`)
4. Click Login

### Method 2: Barcode Scan
1. Click "Student Kiosk"
2. Select "Scan Card" tab
3. Place library card on scanner (or paste barcode)
4. System auto-recognizes and logs in

**Security Note:** Kiosk login is session-based and auto-logs out when you exit.

---

## 📚 Kiosk Features

### 1. **Borrow Books** 📖
Students can:
- ✓ Search available books by title or author
- ✓ View book details (title, author, category, availability)
- ✓ Select and confirm borrow
- ✓ Get instant confirmation with due date (2 weeks)
- ✓ Prevents double-borrowing of same book

### 2. **My Books** 📚
Students can view:
- ✓ All currently borrowed books
- ✓ Days remaining before due date
- ✓ Visual indicator for books due soon (red warning)
- ✓ Books that are overdue (highlighted)

### 3. **Contact Librarian** 💬
Students can message library staff:
- ✓ Send questions and requests
- ✓ View conversation history
- ✓ Delete own messages
- ✓ See librarian responses
- ✓ Know that staff reply during office hours

### 4. **Community Chat** 👥
Students can:
- ✓ Share messages with other students
- ✓ See who posted (name, class level)
- ✓ Like posts (shows like count)
- ✓ Recommend books to peers
- ✓ Delete own messages
- ✓ Maximum 280 characters per message
- ✓ Follow community guidelines

---

## 👤 Student Information

Students register with:
- **Name** - Full name
- **Email** - School email
- **Phone** - Contact number
- **Student ID** - Unique identifier (e.g., `GSB-001`)
- **Card Barcode** - Library card barcode
- **Class** - School level (S1-S6)
  - S1 = Senior 1 (Year 7)
  - S2 = Senior 2 (Year 8)
  - S3 = Senior 3 (Year 9)
  - S4 = Senior 4 (Year 10)
  - S5 = Senior 5 (Year 11)
  - S6 = Senior 6 (Year 12)
- **Max Books** - Maximum books allowed (default: 5)

---

## 🎯 Class System (S1-S6)

The Rwandan school system is organized into:

| Class | Level | Age |
|-------|-------|-----|
| S1 | Senior 1 | ~14 years |
| S2 | Senior 2 | ~15 years |
| S3 | Senior 3 | ~16 years |
| S4 | Senior 4 | ~17 years |
| S5 | Senior 5 | ~18 years |
| S6 | Senior 6 | ~19 years |

Students can filter by class in the community chat and use this for peer interaction.

---

## 📨 Messaging System

### Librarian Inbox
- **Direct messaging** with library staff
- Useful for:
  - Asking about book availability
  - Requesting book purchases
  - Reporting damaged books
  - Asking about lost books
  - General library questions

### Community Chat
- **Public discussions** visible to all students
- Great for:
  - Book recommendations
  - Study group formation
  - Sharing favorite authors
  - Peer-to-peer help
  - Library event announcements

---

## 🔄 Barcode Implementation

### How Barcodes Work

1. **Generate Barcodes**
   - Each library card has a unique barcode
   - Can use any barcode format (Code128, EAN-13, QR code)

2. **Register in System**
   - When adding a member, enter the barcode value
   - System stores it in the member's profile

3. **Scan at Kiosk**
   - Place card on barcode scanner
   - Scanner inputs barcode value
   - System matches and logs student in

### QR Code Example
```
Generate QR for: GSB-StudentID-12345
Display on library card
Scan with standard QR scanner
```

---

## 🖥️ Kiosk Setup for School Library

### Hardware Requirements
- Dedicated library computer (Windows/Mac/Linux)
- Optional: Barcode scanner or QR code reader
- Optional: Touchscreen monitor for better UX
- Monitor: 21"+ recommended for visibility

### Software Setup
```bash
# Install dependencies once
npm install

# Start the application
npm run dev

# Access at http://localhost:3000
```

### Browser Tips
- Use **full screen** mode (F11)
- Disable back button navigation
- Set browser homepage to localhost:3000
- Put in kiosk/presentation mode if available

### Network
- Works **offline** with cached data
- Can work **online** for real-time updates
- Restart browser to clear session

---

## 📊 Data Management

### What Students Can Do
- ✓ Borrow books (limited by `maxBooks`)
- ✓ View their current books
- ✓ Send messages to librarian
- ✓ Chat with community
- ✓ Like posts from others
- ✓ Delete own messages/posts

### What Students Cannot Do
- ✗ Edit other students' messages
- ✗ Delete librarian's accounts
- ✗ Modify book inventory
- ✗ Create new members
- ✗ View detailed analytics

### What Librarians Can Do
- ✓ Full access to all features
- ✓ Manage books and inventory
- ✓ Register new members
- ✓ View all transactions
- ✓ Send SMS notifications
- ✓ Moderate community chat (future)
- ✓ Respond to student messages

---

## 🚀 Quick Start Checklist

- [ ] **Add Students**
  - Go to Librarian Dashboard
  - Add members with Student ID and Card Barcode
  - Assign class level (S1-S6)

- [ ] **Add Books**
  - Register all library books in system
  - Set number of copies available

- [ ] **Setup Kiosk Computer**
  - Open app at http://localhost:3000
  - Test Student ID login
  - Test Barcode scan (if using scanner)
  - Test borrowing workflow

- [ ] **Configure Student IDs**
  - Decide on ID format (e.g., `GSB-001`)
  - Print on student cards or library cards
  - Create physical barcodes

- [ ] **Train Students**
  - Show how to login (ID or barcode)
  - Demonstrate borrow process
  - Explain community chat
  - Explain message to librarian

- [ ] **Set Office Hours**
  - Inform students when librarian replies
  - Monitor messages daily

---

## 🔧 Configuration

### Update Student Limits
Edit `app/components/MembersSection.tsx`:
```javascript
<option>Max Books</option>
// Change default from 5 to your preference
const [maxBooks, setMaxBooks] = useState(10)
```

### Change Loan Duration
Edit `app/lib/database.ts`:
```javascript
const dueDate = new Date()
// Change from 14 to your preferred number
dueDate.setDate(dueDate.getDate() + 14)
```

### Customize Chat Rules
Edit `app/components/PeerChat.tsx`:
```javascript
<li>✓ Be respectful and kind</li>
// Add or modify guidelines here
```

---

## 📱 Mobile Responsiveness

The kiosk works on:
- ✓ Desktop computers
- ✓ Tablets (iPad, Android tablets)
- ✓ Large smartphones

The interface automatically adjusts:
- Touch-friendly buttons on mobile
- Larger text for readability
- Full-screen optimized layout

---

## 🔒 Security Considerations

### Kiosk Session
- ✓ Auto-logout when browser closes
- ✓ No data stored in browser
- ✓ Each session independent

### Privacy
- ✓ Student messages visible only to themselves and librarian
- ✓ Librarian can moderate community chat
- ✓ No sensitive data in chat
- ✓ Students can delete their own content

### Best Practices
- Keep librarian password strong
- Regularly backup data
- Monitor community chat for inappropriate content
- Clear browser cache regularly

---

## 📖 Usage Examples

### Example 1: Student Borrows a Book
1. Walk up to library kiosk
2. Enter Student ID: `GSB-045`
3. See available books
4. Click on "Introduction to Python"
5. Confirm borrow
6. Get confirmation: "Book borrowed successfully! Due in 2 weeks."
7. Check "My Books" to confirm

### Example 2: Student Asks Librarian Question
1. Login to kiosk
2. Click "Contact Librarian"
3. Type: "Do you have books on Chemistry?"
4. Librarian sees message and responds
5. Student sees response next time they log in

### Example 3: Community Chat
1. Login to kiosk
2. Click "Community Chat"
3. See posts from other S3, S4, S5, S6 students
4. Post: "Who's read 'Things Fall Apart'? Great book!"
5. Other students like and reply

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Barcode won't scan | Check scanner settings, try manual entry |
| Student ID not found | Verify student was added in Dashboard |
| Chat messages disappear | Clear browser cache, restart app |
| Slow performance | Close other browser tabs, restart app |
| Can't login at all | Check browser console (F12 → Console) |

---

## 🎓 Training Resources

### For Librarians
- Train on Dashboard features first
- Understand book management
- Learn transaction system
- Practice SMS notifications

### For Students
- 5-minute orientation
- Demo borrow and return
- Show message feature
- Explain community chat

### Supporting Materials
- Print quick reference guide
- Create instructional posters
- Make short video tutorial
- Post in library

---

## 🚀 Future Enhancements

Potential features to add:
- [ ] Book reservations
- [ ] Reading challenges
- [ ] Virtual library card QR codes
- [ ] Book ratings and reviews
- [ ] Reading goals tracker
- [ ] Parent notifications
- [ ] E-book integration
- [ ] Check in/out receipts
- [ ] Photo upload for community
- [ ] Events calendar

---

## 📞 Support

**For Setup Help:**
1. Check the main README.md
2. Review SETUP_GUIDE.md
3. Check console errors (F12 key)

**For Student Issues:**
- Librarian available during office hours
- Can troubleshoot through Messages system
- Physical kiosk support available at desk

**For Admin Issues:**
- Check database integrity
- Verify student IDs match exactly
- Clear browser cache
- Restart application

---

**Last Updated:** April 2026
**Version:** 1.0
**School:** GS Busanza
