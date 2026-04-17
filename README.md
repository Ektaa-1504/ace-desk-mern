# AceDesk – AI-Powered MERN LMS Platform 🎓🚀

AceDesk is a modern, full-stack Learning Management System (LMS) built with the MERN stack (MongoDB, Express, React, Node.js). It empowers educators to create and publish courses while providing students with an interactive learning experience enhanced by Google's Gemini AI.

## ✨ Key Features

### 👨‍🎓 For Students
- **Course Enrollment:** Browse available courses and purchase them securely using the integrated Razorpay payment gateway.
- **Video Learning:** Interactive video player for course lectures.
- **Course Reviews:** Rate and write reviews for courses you've taken.
- **AI Learning Tools (Exclusive for Enrolled Students):**
  - **🤖 AI Tutor:** Ask doubts about any course topic and get instant, beginner-friendly explanations.
  - **📇 AI Flashcards:** Automatically generate study flashcards summarized from the course content.
  - **📝 AI Quiz:** Test your knowledge with dynamically generated 5-question multiple-choice quizzes with instant AI grading and feedback.

### 👨‍🏫 For Educators
- **Educator Dashboard:** Analytics and overview of published courses.
- **Course Creation:** Build courses, set pricing, upload thumbnails (via Cloudinary), and publish them instantly.
- **Curriculum Management:** Easily add, edit, and organize video lectures.

### 🛡️ Security & Authentication
- **Role-Based Access Control (RBAC):** Distinct dashboards and access scopes for "Students" and "Educators".
- **Secure Authentication:** JWT-based login securely stored in HTTP-only cookies.
- **Password Recovery:** Secure email OTP (One-Time Password) system for password resets.

---

## 🛠️ Tech Stack

#### Frontend:
- **React 18** (bootstrapped with **Vite**)
- **Tailwind CSS** (for styling)
- **Redux Toolkit** (State Management)
- **React Router** (Routing)
- **Axios** (API requests)
- **Framer Motion** (Animations)

#### Backend:
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **Firebase** (Frontend hosting/auth utils)
- **Razorpay SDK** (Payment processing)
- **Cloudinary** (Media & image hosting)
- **Google Gen AI SDK (Gemini)** (Powering the AI Tutor, Quizzes, and Flashcards)
- **Nodemailer** (Email notifications and OTPs)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/Ektaa-1504/ace-desk-mern.git
cd ace-desk-mern
```

### 2. Environment Variables Setup
The project requires sensitive API keys to function. I have provided template files for you to use.

**Backend (.env):**
1. Navigate to the `backend` folder.
2. Rename `.env.example` to `.env`.
3. Fill in your personal API keys (MongoDB URI, Cloudinary, Razorpay, Gemini, Nodemailer credentials).

**Frontend (.env):**
1. Navigate to the `frontend` folder.
2. Rename `.env.example` to `.env`.
3. Fill in your Razorpay Key ID and Firebase configuration.

### 3. Install Dependencies & Run

**Start the Backend server:**
```bash
cd backend
npm install
npm run dev
```
*(Server will start on http://localhost:8000)*

**Start the Frontend server:**
```bash
cd frontend
npm install
npm run dev
```
*(Client will start on http://localhost:5173)*

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is open-source and available under the MIT License.
