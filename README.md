# EduVerse — Research-Driven E-Learning Platform & Learner CRM

[![GitHub](https://img.shields.io/badge/GitHub-Eduverse-blue?logo=github)](https://github.com/dhanush2k06/Eduverse.git)
[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite_6-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=node.js)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Auth_%26_Cloud-Firebase_v11-FFCA28?logo=firebase)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

EduVerse is a modern, content-first e-learning platform featuring an isolated, staff-facing **Learner CRM and Operations Portal**. Engineered strictly in accordance with [`references/implementation_plan.md`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/references/implementation_plan.md) and the exact visual layout references in [`references/reference1.png`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/references/reference1.png) and [`references/reference_design.png`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/references/reference_design.png).

---

## 🌟 Dual-Portal Architecture & Separation of Concerns

The platform runs two strictly separated web applications sharing a unified design language and API:

```mermaid
flowchart TD
    subgraph PublicApp["🌐 Public Learning Portal (Port 5173)"]
        LP[Landing & Explore]
        CD[Course Detail & Syllabus]
        RL[Research Library]
        SP[Skill Passport]
        LL[Learner Login & Signup]
        LD[Learner Dashboard]
        LR[Reading-First Lesson Engine]
        QZ[Interactive Quizzes]
    end

    subgraph CRMApp["🛡️ Learner CRM & Operations Portal (Port 5174)"]
        CL[Dedicated Admin CRM Login]
        AD[Admin Overview Dashboard]
        CDIR[Learner Directory & Filters]
        C360[Learner 360° Profiles]
        NOTES[Internal Staff Notes]
        FU[Follow-up Status Manager]
        CM[Course Lifecycle Manager]
        RM[Research Citations Manager]
    end

    subgraph BackendAPI["⚡ Backend REST API (Port 5000)"]
        AUTH[Auth Middleware & RBAC]
        ROUTER[Express API Routes]
        STORE[Data Store & State Engine]
    end

    subgraph FirebaseCloud["🔥 Firebase Cloud Services (Spark Free Plan)"]
        FA[Firebase Authentication]
        FS[Cloud Firestore]
        ST[Firebase Storage]
    end

    PublicApp -->|REST Calls + JWT| BackendAPI
    CRMApp -->|Admin REST Calls + JWT| BackendAPI
    BackendAPI --> FirebaseCloud
    PublicApp -.->|Direct Auth & Analytics| FirebaseCloud
    CRMApp -.->|Direct Auth| FirebaseCloud
```

### 🔒 Complete Authentication Separation
- **Public Site (`http://localhost:5173`):**
  - **Learner Login & Signup Only:** Allows email/password registration and Google OAuth sign-in.
  - **Admin Exclusion:** The administrative email (`dhanushharidoss47@gmail.com`) is **strictly blocked** from signing in or signing up on the public learner site.
  - **Route Protection:** All `/admin/*` routes are removed from the router and redirect to home.
- **CRM Portal (`http://localhost:5174`):**
  - **Dedicated CRM Login (`CRMLoginPage`):** A custom dark-mode, high-security login interface.
  - **Learner Exclusion:** Only the configured administrator account (`dhanushharidoss47@gmail.com`) is authorized to access the CRM. Non-admin users are rejected with an explicit access denied notice.
  - **No Signup:** Self-registration is disabled on the CRM site.
  - **Route Protection:** All learner routes (`/learn/*`) and public browsing pages are inaccessible and redirect to CRM login.

---

## 🔑 Configured Credentials

| Portal | URL | Role | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **CRM Admin Portal** | `http://localhost:5174/login` | Administrator | `dhanushharidoss47@gmail.com` | `Dhanush47#` |
| **Public Learning Site** | `http://localhost:5173/login` | Learner | *(Any registered learner email or Google OAuth)* | *(User chosen)* |

*Note: The platform features automatic admin provisioning — on first login with the configured admin credentials, the Firebase user account is automatically initialized if not already existing.*

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies

```powershell
git clone https://github.com/dhanush2k06/Eduverse.git
cd Eduverse

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### 2. Environment Configuration

Copy the example environment files:
```powershell
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Your `client/.env` comes pre-configured with the project's Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyAUQ24yVn6M6NhCJHL19fw8YYkmkPYV3mo
VITE_FIREBASE_AUTH_DOMAIN=eduverse-e0eb4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=eduverse-e0eb4
VITE_FIREBASE_STORAGE_BUCKET=eduverse-e0eb4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=942069506724
VITE_FIREBASE_APP_ID=1:942069506724:web:577b70a0fbb11096513c31
VITE_FIREBASE_MEASUREMENT_ID=G-N5HNSHQYX2
```

### 3. Run the Services Separately

Open three terminals from the project root:

#### Terminal 1 — Backend Express Server
```powershell
npm run start:server
```
*API runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)*

#### Terminal 2 — Public Learning Site
```powershell
npm run start:public
```
*Public learner site runs on `http://localhost:5173`*

#### Terminal 3 — Learner CRM & Operations Portal
```powershell
npm run start:crm
```
*CRM admin portal runs on `http://localhost:5174`*

---

## 📦 Key Pages & Features

### 1. Public Learning Portal (`:5173`)
- **Landing Page (`/`):** Value proposition, research-backed pedagogy highlights, stats, and flagship course previews.
- **Explore Courses (`/explore`):** Dynamic search, difficulty filters, and categorized course catalog (*Thinking & Intelligence*, *Communication*, *Interpersonal Skills*, *Creativity & Innovation*, *Personal Development*, *Practical Life Skills*, *Exploration*).
- **Course Detail (`/courses/:slug`):** Syllabus, estimated reading durations, module previews, learning outcomes, and direct enrollment.
- **Research Library (`/research`):** Traceable academic citations with verified authors, publication dates, DOIs, and credibility audits.
- **Skill Passport (`/skill-passport`):** Competency mastery meters, portfolio records, and certificate generation with celebration confetti.
- **Learner Dashboard (`/learn`):** Active courses, continue-learning shortcuts, streak counters, and upcoming activities.
- **Reading-First Lesson Reader (`/learn/lessons/:lessonId`):** Clean reading interface with collapsible syllabus, progress tracking, callout blocks, case studies, comparison tables, and download resources.
- **Quiz & Assessment Engine (`/learn/activities/:activityId`):** Live timer, multiple-choice questions, instant pedagogical explanations, and score tracking.

### 2. Learner CRM & Operations Portal (`:5174`)
- **Executive CRM Dashboard (`/admin`):** High-level KPI metrics (Total Learners, Active Courses, Completion Rate, Growth SVG charts) and real-time activity feeds.
- **Learner Directory (`/admin/crm`):** Filterable, searchable directory with support status (`Needs Attention`, `Contacted`, `Resolved`), enrolled courses, and last active dates.
- **Learner 360° Profile (`/admin/crm/learners/:userId`):** Complete learner history, course progress, quiz results, plus an **internal staff notes thread** and **live follow-up status updater**.
- **Course Lifecycle Manager (`/admin/courses`):** Content publishing workflow (`Draft` → `In Review` → `Approved` → `Published` → `Archived`).
- **Research Citations Manager (`/admin/research`):** Peer-reviewed evidence manager linked directly to course lessons.

---

## 🧪 Testing

Run backend tests verifying all business logic and CRM modules:
```powershell
npm run test:server
```
All 10 tests verify:
- Category & Course catalog loading
- Lesson content blocks & research source linking
- Server-side quiz scoring & validation
- CRM overview telemetry aggregation
- Learner directory search and filtering
- Learner 360° profile generation
- Internal staff notes creation
- Follow-up status persistence

---

## 📄 License & Documentation
- **[FIREBASE_SETUP_GUIDE.md](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/FIREBASE_SETUP_GUIDE.md)** — Free Spark Plan setup instructions
- **[firestore.rules](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/firestore.rules)** — Cloud Firestore security rules
- **[storage.rules](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/storage.rules)** — Firebase Storage security rules
- **[references/implementation_plan.md](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/references/implementation_plan.md)** — Comprehensive MVP specification
