# Student Management System

A complete Student Management System built for the assigned question:

> Develop a Student Management System using Angular.js and Mongo DB with a responsive UI. Implement student registration, add/edit/delete student details, search and filter students, form validation, and display student records in a table.

## Tech Stack
- Frontend: AngularJS 1.8.3, HTML5, CSS3, Bootstrap 5
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Icons: Bootstrap Icons

## Features
- Dashboard with total, active, inactive and department statistics
- Add student
- Edit student
- Delete student
- View student details
- Search by name, ID, email or phone
- Filter by department, year and status
- Client-side form validation
- Server-side validation
- Responsive mobile/tablet/desktop UI
- Attractive dashboard and table UI
- Confirmation before deletion
- Toast notifications
- MongoDB persistence
- Demo mode if MongoDB is unavailable, so the UI can still be presented

## Project Structure

student-management-system/
├── backend/
│   ├── models/Student.js
│   ├── routes/studentRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── README.md

## Requirements
Install:
1. Node.js 18+ (Node.js 20+ recommended)
2. MongoDB Community Server OR MongoDB Atlas
3. VS Code

## Run Backend

Open a terminal in `backend`:

```bash
npm install
```

Copy `.env.example` to `.env`.

For local MongoDB, use:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_management
```

Then:

```bash
npm start
```

Backend runs at:
http://localhost:5000

Health check:
http://localhost:5000/api/health

## Run Frontend

The frontend is a static AngularJS application.

You can open `frontend/index.html` directly in a browser, but VS Code Live Server is recommended.

In VS Code:
1. Install the "Live Server" extension.
2. Right-click `frontend/index.html`.
3. Select "Open with Live Server".

The application expects the backend at:
http://localhost:5000

## MongoDB Atlas

If using MongoDB Atlas, put your connection string in `.env`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/student_management?retryWrites=true&w=majority
```

Do not commit real passwords to GitHub.

## Demo Mode

If MongoDB is not running, the frontend automatically uses local demo data so you can present the UI. CRUD operations in demo mode are stored in browser localStorage.

When the backend and MongoDB are running, the app automatically uses the real API.

## API Endpoints

GET    /api/students
GET    /api/students/:id
POST   /api/students
PUT    /api/students/:id
DELETE /api/students/:id

## Suggested Presentation Flow

1. Open Dashboard
2. Show statistics cards
3. Click "Add Student"
4. Demonstrate required-field validation
5. Add a student
6. Search for the student
7. Filter by department/year/status
8. Edit the student
9. Open View Details
10. Delete a student
11. Explain MongoDB + Express + AngularJS architecture

## Important

This project uses AngularJS (the technology named in the question), not modern Angular CLI.
