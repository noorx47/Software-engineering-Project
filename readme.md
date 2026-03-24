# 🛒 Shared Shopping List App

A web application that allows flatmates to collaboratively manage shopping lists in real time.

## 👥 Team
- Harnoor Singh
- 

## 📋 Features
- User registration and login with JWT authentication
- Create and manage multiple shopping lists
- Add items with name, quantity and category
- Tick off items when bought
- Invite flatmates to share lists
- Real product images from Open Food Facts API
- Auto refresh every 5 seconds
- Input validation and security

## 🛠️ Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, express-validator
- **Testing:** Jest, Supertest
- **Deployment:** Docker, Docker Compose

## 🚀 How to Run

### Option 1 — With Docker (recommended)
Make sure Docker Desktop is running, then:
```bash
docker-compose up --build
```
App runs at http://localhost:3000

### Option 2 — Without Docker
1. Install dependencies:
```bash
cd backend
npm install
```

2. Make sure MongoDB is running:
```bash
brew services start mongodb-community
```

3. Start the server:
```bash
npm run dev
```

4. Open `frontend/index.html` with Live Server in VS Code

## 🧪 Running Tests
```bash
cd backend
npm test
```

## 🔒 Security
- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Input validation on all routes
- Protected API endpoints

## 🧪 Test Coverage

  - User registration validation
  - Login authentication
  - List creation and retrieval
  - Item management
  - Security (unauthorized access)