# Smart Hostel Management System

This repository contains a MERN-stack Smart Hostel Management System (React, Tailwind CSS, Node.js, Express, MongoDB, JWT).

Features
- User authentication (JWT)
- Role-based access (student, warden, admin)
- Notices, GatePass requests, Complaints management

Quick start
1. Backend
   - Copy `backend/.env.example` to `backend/.env` and set values.
   - Install and run:
```
cd backend
npm install
npm run dev
```
2. Frontend
   - Copy `frontend/.env.example` to `frontend/.env` and set `REACT_APP_API_URL`.
```
cd frontend
npm install
npm start
```

Environment variables
- See `backend/.env.example` and `frontend/.env.example` for required keys. Do NOT commit real secrets.

Notes
- This repo has been cleaned for GitHub: `.env` files and `node_modules` should be ignored. Remove any local secrets before pushing.
