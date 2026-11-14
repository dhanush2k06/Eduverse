# EduVerse — Research-Driven E-Learning Platform & Learner CRM

EduVerse is a modern, content-first e-learning platform with a dedicated Learner CRM and operations portal, engineered specifically using the specification in [`references/implementation_plan.md`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/references/implementation_plan.md) and the exact visual designs in [`references/reference1.png`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/references/reference1.png) and [`references/reference_design.png`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/references/reference_design.png).

---

## 🌟 Key Architecture & Product Features

### 1. Public Learning Portal
- **Brand Identity & Aesthetics:** Editorial, calm, and distraction-free interface built with Tailwind CSS and Inter typography.
- **Hero & Value Proposition:** "Learn Beyond Your Domain" with research-backed courses and practical knowledge.
- **Course Discovery (`/explore`):** Dynamic search, sorting, and category filters (*Thinking & Intelligence*, *Communication*, *Interpersonal Skills*, *Creativity & Innovation*, *Personal Development*, *Life Skills*, *Exploration*).
- **Course Detail & Syllabus (`/courses/:slug`):** Comprehensive breakdown of learning outcomes, modules, reading-time estimates, and instant enrollment.
- **Research Library (`/research`):** Transparent academic citations with authors, publication dates, DOIs, and credibility audits.
- **Skill Passport (`/skill-passport`):** Verifiable competencies, assessed mastery percentages, and certificate generation with celebration confetti.
- **Authentication (`/login`, `/signup`):** Firebase email/password and Google OAuth, plus **1-click quick demo login buttons** for instant evaluation.

### 2. Learner Experience
- **Learner Dashboard (`/learn`):**
  - Welcome greeting: *"Welcome back, Priya! 👋"*
  - **7-Day Streak 🔥** momentum counter.
  - 4 Key Stat Cards: Enrolled Courses (5), Completed (3), Learning Hours (24.5h), Skill Level (Intermediate).
  - **Continue Learning Card:** "Data Science Fundamentals" (Module 3: Data Visualization, 75% progress bar, [Continue] button).
  - **Upcoming Activities:** Quiz reminders and assignment submission portals.
  - **Skill Progress Visuals:** Interactive percentage gauges for Data Science (78%), Communication (72%), and Problem Solving (66%).
  - **Achievements:** Quick Learner, Top Performer, Course Star badges.
- **My Courses (`/learn/my-courses`):** Active reading modules, progress indicators, and completion certificates.
- **Reading-First Lesson Interface (`/learn/lessons/:lessonId`):**
  - Collapsible course overview and lesson syllabus sidebar.
  - Course-level progress and green **"✓ Mark as Complete"** action.
  - Rich structured content blocks (Key Takeaway callouts, System 1 vs 2 comparison tables, 8 Universal Intellectual Standards, Case Study callouts, Warning boxes, and interactive reflection prompts).
  - Downloadable Practice Resources (PDF guides, CSV datasets, worksheets).
  - Peer-reviewed research references drawer with direct citation metadata.
- **Knowledge Checks & Quizzes (`/learn/activities/:activityId`):**
  - Live countdown timer and points tracker.
  - Multiple-choice cards with server-side answer verification.
  - Immediate feedback with detailed pedagogical explanations and confetti celebration.

### 3. Learner CRM & Operations Portal (CRM Site)
- **CRM Overview Dashboard (`/admin`):**
  - Executive Metrics: Total Learners (12,480, +12%), Active Courses (48), Completion Rate (76%), Revenue/Progress (₹2,48,000, +18%).
  - **Learner Growth Chart:** Interactive SVG chart comparing *This Month* vs *Last Month*.
  - Real-time telemetry activity feed (enrollments, quiz attempts, completions).
- **Learner CRM Directory (`/admin/crm`):**
  - Searchable by learner name or email.
  - Filters by account status (`Active`, `Inactive`) and support status (`Needs Attention`, `Contacted`, `Resolved`).
  - Directory table showing enrolled courses count, completed count, learning hours, and follow-up status.
- **Learner 360° Profile View (`/admin/crm/learners/:userId`):**
  - Comprehensive telemetry overview of learner progress, streak, and quiz performance.
  - **Internal Staff Notes:** Private staff note thread to record support interventions, mentoring, and follow-ups.
  - **Follow-up Status Manager:** Update status to `Needs Attention`, `Contacted`, or `Resolved` in real time.
- **Course Lifecycle & Publication (`/admin/courses`):**
  - Manage publication workflow states: `Draft` → `In Review` → `Approved` → `Published` → `Archived`.
  - Add new courses with categories, difficulty, duration, and thumbnail.
- **Research Citations Manager (`/admin/research`):**
  - Add peer-reviewed academic papers and link claims to course lessons.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router v6, Lucide React, Canvas Confetti |
| **Backend API** | Node.js, Express REST API, Firebase Admin SDK, CORS, Dotenv |
| **Authentication** | Firebase Authentication (Email/Password, Google OAuth) + Mock Dev Personas |
| **Database** | Cloud Firestore + In-Memory Seeded State Store for Instant Out-of-the-Box Demo |
| **Storage** | Firebase Storage for course diagrams, PDFs, and worksheets |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Dependencies are already installed. If needed, you can install them anytime:
```powershell
# In the EduTech root directory:
cd server && npm install
cd ../client && npm install
```

### 2. Run the Platform

**Start the Backend API Server:**
```powershell
cd server
npm start
```
*The API starts on `http://localhost:5000` with health check at `http://localhost:5000/api/health`.*

**Start the React Frontend Client:**
In a second terminal:
```powershell
cd client
npm run dev
```
*The Vite client runs on `http://localhost:5173` with automatic API proxying.*

---

## 🔑 Demo Personas & Instant Switcher

To easily evaluate both the Public/Learner site and the CRM portal without creating accounts:
1. Open `http://localhost:5173`.
2. In the top navigation bar, click the persona switcher pill:
   - **Learner:** Instantly loads as **Priya Sharma** (Active learner with 7-day streak, 5 enrolled courses, 3 completed courses, and 78% Data Science mastery).
   - **Admin CRM:** Instantly switches into **Admin Sarah** with full access to the Learner CRM directory, 360° profiles, course publication lifecycle, and research manager.
3. You can also visit `/login` and use the 1-click demo buttons.

---

## 📖 Firebase Setup (Free Spark Plan)

For detailed, step-by-step instructions on setting up Firebase Authentication, Cloud Firestore, and Firebase Storage under the free Spark plan, consult:
- **[FIREBASE_SETUP_GUIDE.md](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/FIREBASE_SETUP_GUIDE.md)**
- **[firestore.rules](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/firestore.rules)**
- **[storage.rules](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/storage.rules)**

