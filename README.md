# HisabKitab - Digital Khata App

HisabKitab is a modern, web-based digital ledger application tailored for small business owners to manage customer accounts ("Khata") efficiently. It allows you to track credits and debits, send payment reminders, and communicate with customers, all through a clean and intuitive interface.

## Features

*   **Digital Ledger**: Record "You Gave" (Credit) and "You Got" (Payment) transactions with ease.
*   **Customer Management**: Add and manage customer details (Name, Phone Number).
*   **Real-time Balance**: Auto-calculated net balance (Due/Advance) for each customer.
*   **Transactions History**: Edit or delete transactions within a 1-hour window.
*   **Messaging System**: Integrated chat interface to send text messages and image attachments (e.g., bills, receipts) to customers.
*   **WhatsApp Reminders**: One-click "Click-to-Chat" feature to send pre-filled payment reminders via WhatsApp.
*   **Dashboard**: Overview of total receivables and payables.
*   **Secure Authentication**: User registration and login protected by JWT authentication.

## 🛠️ Technology Stack

**Frontend:**
*   **React** (Vite Project)
*   **Tailwind CSS** (Styling)
*   **Zustand** (State Management)
*   **Lucide React** (Icons)

**Backend:**
*   **Node.js** & **Express**
*   **Prisma ORM** (Database Management)
*   **SQLite** (Database)
*   **Multer** (File Uploads)
*   **JSON Web Token (JWT)** (Authentication)

## Installation & Setup

Prerequisites: Ensure you have **Node.js** installed on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/animeshpunetha/HisabKitab.git
cd HisabKitab
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Set up the database:
```bash
# Initialize Prisma and create the SQLite database
npx prisma migrate dev --name init
```

Start the server:
```bash
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
# App runs on http://localhost:5173
```

## Environment Variables

**Server (`server/.env`)**
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_key_change_this"
```

## Usage

1.  **Register/Login**: Create an account to start your secure personal ledger.
2.  **Add Customers**: Go to the "Customers" tab and add new contacts.
3.  **Record Transactions**: Click on a customer to open their ledger. Button "You Gave" adds a debit, "You Got" adds a credit.
4.  **Send Reminders**: Use the WhatsApp button in the header to remind customers of their pending dues.
5.  **Attach Proofs**: Upload images of bills or items directly in the chat stream.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is open-source and available under the [MIT License](LICENSE).
