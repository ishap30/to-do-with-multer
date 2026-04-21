# 📝 Personal Todo API

A simple backend using Express and MongoDB to manage your daily tasks with priorities and due dates.

---

## 🚀 Setup

### Install

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/my-todos
```

### Run

```bash
npm run dev   # development
npm start     # production
```

---

## 📦 Todo Fields

* `title` (String, required)
* `completed` (Boolean, default: false)
* `priority` (low / medium / high, default: medium)
* `dueDate` (Date, optional)
* `createdAt`, `updatedAt` (auto)

---

## 🔌 API

### Get all todos

```
GET /todos
```

Filters:

* `priority=low|medium|high`
* `completed=true|false`
* `sortBy=dueDate|priority|createdAt`

---

### Get one todo

```
GET /todos/:id
```

---

### Create todo

```
POST /todos

{
  "title": "Buy groceries",
  "priority": "high",
  "dueDate": "2025-05-01"
}
```

---

### Update todo

```
PUT /todos/:id
```

Send only fields you want to change.

---

### Toggle complete

```
PATCH /todos/:id/toggle
```

---

### Delete one

```
DELETE /todos/:id
```

---

### Delete completed

```
DELETE /todos/completed
```

---

## 🗂 Structure

```
server.js
src/
  config/
  models/
  controllers/
  routes/
```
