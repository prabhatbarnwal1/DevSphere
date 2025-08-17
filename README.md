# DevSphere

DevSphere is a full-stack web application for developers to connect, share posts, and collaborate. It features user authentication, profile management, and a social feed for posts and collaborations.

## Features

- User authentication (sign up, login, JWT-based sessions)
- User profiles with skills, tech stack, and social links
- Create, view, and collaborate on posts
- Responsive UI built with React and Tailwind CSS
- RESTful API backend with Express and PostgreSQL

## Tech Stack

- **Frontend:** React, React Router, Zustand, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express, PostgreSQL, JWT, bcrypt
- **Database:** PostgreSQL

---

## Installation

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- PostgreSQL

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/DevSphere.git
cd DevSphere
```

---

### 2. Setup the Database

- Create a PostgreSQL database (e.g., `devsphere`).
- Run the SQL script to create tables:

```bash
psql -U your_db_user -d devsphere -f server/database/db.sql
```

- Create a `.env` file in the `server/` directory with the following variables:

```
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/devsphere
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
PORT=5000
```

---

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 4. Running the Application

#### Start the Backend

```bash
cd server
npm start
```

#### Start the Frontend

```bash
cd client
npm run dev
```

- The frontend will be available at `http://localhost:5173` (default Vite port).
- The backend runs on `http://localhost:5000` (or the port you set in `.env`).

---

## Folder Structure

```
DevSphere/
  client/      # React frontend
  server/      # Express backend
```

---

## Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production

### Backend

- `npm start` - Start backend with nodemon

---
