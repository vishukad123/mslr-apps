
## 🔒 Security

- **No secrets or credentials are included in this repository.** All sensitive information (such as database passwords, JWT secrets, etc.) must be provided via environment variables in your own `.env` files. These files are gitignored by default.
- **All protected API endpoints require JWT authentication.**
- **User input is validated on both client and server.**
- **Dependencies should be kept up to date** using `npm audit` or similar tools.
- **If you discover a security vulnerability, please report it by opening a GitHub issue or emailing vak9@student.le.ac.uk.**

For more details, see [SECURITY.md](SECURITY.md).

# My Shangri-La Referendum (MSLR)

> **Open Source, Secure, and Modern Referendum Management Platform**

---

## 🚀 Overview

My Shangri-La Referendum (MSLR) is a full-stack, open-source web application for secure, transparent, and user-friendly referendum management and voting. Designed for both voters and election commissions, MSLR is built with best practices in mind and is ready for real-world deployment or educational use.

---

## ✨ Features

- **Voter Registration & Authentication**
  - Secure registration with SCC (unique code) validation
  - Email uniqueness and SCC usage checks
  - Passwords hashed with bcrypt
  - JWT-based authentication for all users
  - Remembers last used username (localStorage)

- **Voter Dashboard**
  - View all available referendums
  - Vote on open referendums (one vote per referendum)
  - See which referendums you’ve already voted in
  - Real-time feedback with toast notifications
  - Responsive, accessible UI (Material-UI)

- **Election Commission Dashboard**
  - Create, edit, and manage referendums (title, description, options)
  - Set referendum status (open/closed) with confirmation dialogs
  - Read-only fields after a referendum is opened
  - Manual and (optionally) automatic closing of referendums
  - Visualize results with charts (Chart.js)
  - Filter and search referendums by status

- **RESTful API**
  - `/mslr/referendums?status=open|closed` — List referendums by status
  - `/mslr/referendum/:id` — Get details for a specific referendum
  - Secure endpoints (JWT required for protected actions)
  - Consistent, well-documented JSON responses

- **Security & Reliability**
  - JWT authentication for all protected routes
  - Server-side and client-side validation
  - No sensitive data in frontend code
  - Error handling with user-friendly messages

- **Developer Experience**
  - Clean, modular codebase (React, Node.js, Express, MySQL)
  - Easy to extend and customize
  - MIT Licensed — free for personal, academic, or commercial use

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MySQL (or compatible database)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/mslr-apps.git
   cd mslr-apps
   ```
2. **Database:**
   - Import `mslr.sql` into your MySQL instance.
   - Update `.env` in `/backend` with your DB credentials.
3. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. **Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```
5. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

---

## 🗄️ Database Schema & Data

- The file [`vak9@student.le.ac.uk.sql`](vak9@student.le.ac.uk.sql) contains the full database schema and sample data for this project.
- To set up your database, simply import this file into your MySQL instance before running the backend server.

---

## 📚 API Documentation

### Referendums by Status
`GET /mslr/referendums?status=open|closed`

### Referendum by ID
`GET /mslr/referendum/:id`

See [backend/src/controllers/apiController.js](backend/src/controllers/apiController.js) for full details.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request. For major changes, open an issue first to discuss what you’d like to change.

---

## 🛡️ Best Practices Followed

- Clear, modular folder structure (separate frontend/backend)
- Consistent naming conventions and code style
- Descriptive variable and function names
- Conversational, human-readable comments
- No hard-coded secrets or credentials in code
- All forms validated on both client and server
- Error handling with actionable feedback
- MIT License for maximum openness

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.