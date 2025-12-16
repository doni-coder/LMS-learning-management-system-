# 🎓 Learning Management System (LMS)

A **full-stack Learning Management System** where instructors can create and manage courses, and students can enroll, learn, and track their progress.  
Built with scalability, clean architecture, and real-world production practices.

🔗 **Live Project:**  
https://lms-learning-management-system-blond.vercel.app/

---

## 🚀 Features

### 👨‍🏫 Instructor
- Create, update, and delete courses
- Upload course videos & content
- Manage enrolled students
- Track course performance

### 👨‍🎓 Student
- Secure authentication & authorization
- Purchase and enroll in courses
- Watch video lectures
- Track learning progress

### 🔐 Authentication
- Email & password login
- Google OAuth integration
- Session-based authentication using Passport.js

### 💳 Payments
- Secure checkout flow (Stripe integration)
- Webhook-based enrollment confirmation

### ⚙️ Background Jobs
- Email notifications using **BullMQ**
- Redis-based queue processing
- Reliable async task handling

---

## 🏗️ Tech Stack

### Frontend
- React
- Tailwind CSS
- ShadCN UI
- Axios

### Backend
- Node.js
- Express.js
- Passport.js (Local + Google Strategy)

### Databases
- **PostgreSQL** – relational data (users, courses, enrollments)
- **MongoDB** – flexible data (content data, analytics, extra metadata)

### Infrastructure & Tools
- Redis + BullMQ (background jobs)
- AWS S3 (video & asset storage)
- Stripe (payments)
- GitHub Actions (CI/CD)
- Vercel (Frontend deployment)
- Render (Backend deployment)

---

## 🧠 System Design Highlights

- Separation of concerns (controllers, services, routes)
- Event-driven architecture for payments & emails
- Secure session handling using serialize & deserialize
- Scalable background workers
- Optimized API design (RESTful architecture)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- MongoDB
- Redis
- Git

### Clone Repository
```bash
git clone https://github.com/your-username/your-lms-repo.git
cd your-lms-repo

cd server
npm install
npm run dev

cd client
npm install
npm run dev


---

## 🛠️ Environment Variables

```env
PORT=
DATABASE_URL=
MONGO_URI=
REDIS_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_S3_BUCKET=
SESSION_SECRET=


## 📂 Project Structure (Simplified)

