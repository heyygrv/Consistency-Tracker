# 🎯 Consistency Tracker

A beautiful full-stack habit tracking application with a **GitHub-style contribution grid**, streak calculations, and a modern dark-themed UI.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Tech Stack](https://img.shields.io/badge/Express-4-green?logo=express) ![Tech Stack](https://img.shields.io/badge/MongoDB-8-brightgreen?logo=mongodb) ![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-3-blue?logo=tailwindcss)

## ✨ Features

- **GitHub-style Contribution Grid** — Visual heatmap of your daily habit completions over the past year
- **Streak Tracking** — Automatically calculates current streak and longest streak for each habit
- **Daily Toggle** — Mark habits as complete for today with one click
- **Add & Delete Habits** — Full CRUD with custom color selection
- **Per-Habit Grid View** — Click a habit card to filter the contribution grid
- **Responsive Design** — Works beautifully on desktop and mobile
- **Dark Theme** — Sleek glassmorphism UI with smooth animations

## 🛠️ Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS 3     |
| Backend    | Node.js, Express 4                 |
| Database   | MongoDB, Mongoose 8                |
| Icons      | Lucide React                       |

## 📦 Project Structure

```
Consistency Tracker/
├── backend/
│   ├── models/
│   │   ├── Habit.js          # Habit schema
│   │   └── Log.js            # Daily log schema
│   ├── routes/
│   │   └── habits.js         # API endpoints
│   ├── .env.example          # Environment template
│   ├── package.json
│   └── server.js             # Express entry point
├── frontend/
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddHabitModal.jsx
│   │   │   ├── ContributionGrid.jsx
│   │   │   ├── HabitCard.jsx
│   │   │   └── StatsBar.jsx
│   │   ├── api.js            # API wrapper
│   │   ├── App.jsx           # Main app
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** — Either:
  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (local)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Consistency Tracker"
```

### 2. Set up the Backend

```bash
cd backend

# Create your .env file from the template
cp .env.example .env
```

**Edit the `.env` file** with your MongoDB connection string:

```env
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/consistency-tracker

# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/consistency-tracker?retryWrites=true&w=majority

PORT=5000
```

Then install dependencies and start the server:

```bash
npm install
npm run dev
```

The backend will start on `http://localhost:5000`.

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` and automatically proxy API requests to the backend.

### 4. Open the App

Visit **http://localhost:5173** in your browser.

## 📡 API Endpoints

| Method   | Endpoint                    | Description                        |
|----------|-----------------------------|------------------------------------|
| `GET`    | `/api/habits`               | List all habits with streak info   |
| `POST`   | `/api/habits`               | Create a new habit                 |
| `DELETE` | `/api/habits/:id`           | Delete a habit and its logs        |
| `POST`   | `/api/habits/:id/toggle`    | Toggle today's completion          |
| `GET`    | `/api/habits/:id/logs`      | Get logs for a specific habit      |
| `GET`    | `/api/habits/logs/all`      | Get all logs (contribution grid)   |
| `GET`    | `/api/health`               | Health check                       |

## 📝 License

MIT
