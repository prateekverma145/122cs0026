# 122cs0026

This repository contains two Node.js-based microservices:

- **Task 1:** Number window averaging API
- **Task 2:** Social media analytics API (users, posts, comments)

## 🗂 Folder Structure

```
122cs0026/
├── task1/        # Sliding window average from number APIs
└── task2/        # Social platform data analysis (users, posts, comments)
```

---

## 🚀 Task 1 – Sliding Window Numbers API

Fetches numbers from 3rd-party services and maintains a unique sliding window of the last N numbers.

### 📦 Install dependencies

```bash
cd task1
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in `task1/` with:

```
API_TOKEN=your_api_token
WINDOW_SIZE=10
PORT=3000
```

### ▶️ Run

```bash
node index.js
```

### 🧪 API Endpoint

```http
GET /numbers/:numberid
```

- `numberid` can be one of: `p`, `f`, `e`, `r`
- Returns new unique numbers, previous and current window states, and average.

---

## 📊 Task 2 – Social Platform Analytics API

Exposes endpoints to retrieve users, posts, comments, top commenters, and popular/latest posts.

### 📦 Install dependencies

```bash
cd task2
npm install
```

### ⚙️ Environment Variables

Create a `.env` file in `task2/` with:

```
API_TOKEN=your_api_token
```

### ▶️ Run

```bash
node index.js
```

### 🧪 API Endpoints

- `GET /users` – List all users  
- `GET /teams` – List teams  
- `GET /results` – Contest results  
- `GET /users/:userId/posts` – Posts by a user  
- `GET /posts/:postId/comments` – Comments on a post  
- `GET /users/top-commenters` – Top 5 users by total comments  (somtime gives server error)
- `GET /posts?type=popular` – Posts with the highest comment count  (somtime gives server error)
- `GET /posts?type=latest` – Latest 5 posts by ID(somtime gives server error)

NOTE for task 2 optimization is not made  due to time constraints


