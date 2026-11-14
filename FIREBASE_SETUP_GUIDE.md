# Complete Firebase Setup Guide (Spark Free Plan)

This guide provides step-by-step instructions for configuring **Firebase Authentication**, **Cloud Firestore Database**, and **Firebase Storage** under Firebase's **Spark Free Plan** (100% free, no credit card required).

---

## 1. Firebase Spark Free Tier Quotas & Limits

The **Spark Plan** includes generous free tier limits that are ideal for launching, evaluating, and running the EduVerse MVP:

| Service | Spark Free Plan Limits (Zero Cost) |
| :--- | :--- |
| **Firebase Authentication** | **Unlimited** Email/Password & Google OAuth accounts (up to 50k monthly active users) |
| **Cloud Firestore Reads** | **50,000 reads / day** (Free daily replenishment) |
| **Cloud Firestore Writes** | **20,000 writes / day** (Free daily replenishment) |
| **Cloud Firestore Deletes** | **20,000 deletes / day** |
| **Cloud Firestore Storage** | **1 GB stored data** (Free forever) |
| **Firebase Storage (Files)** | **5 GB total asset storage**, **1 GB downloads / day** |
| **Hosting & SSL** | **10 GB storage**, **360 MB/day transfer** |

> **Hybrid Mode Advantage:** The EduVerse codebase includes built-in hybrid support. If Firebase credentials are not yet configured or in local development, it automatically operates in local state mode with seed data. Once you add your Firebase keys, it connects seamlessly!

---

## 2. Step-by-Step Firebase Project Creation

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. **Project Name:** Enter `eduverse-platform` (or any name you prefer).
4. **Google Analytics:** You can enable or disable Google Analytics (either choice is 100% free).
5. Click **Create project** and wait 15 seconds for provisioning.

---

## 3. Step-by-Step: Firebase Authentication Setup

1. In the left navigation sidebar of your Firebase Console, click **Build** > **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - **Email/Password:**
     - Click on **Email/Password**.
     - Toggle **Enable** to ON. Leave "Email link (passwordless sign-in)" disabled.
     - Click **Save**.
   - **Google Sign-In:**
     - Click on **Google**.
     - Toggle **Enable** to ON.
     - Select your project support email.
     - Click **Save**.
4. Under the **Settings** tab:
   - Click **Authorized domains**.
   - Ensure `localhost` is listed (it is added by default). When deploying to production (e.g. Vercel or Netlify), add your custom domain here.

---

## 4. Step-by-Step: Cloud Firestore Database Setup

1. In the left sidebar, click **Build** > **Firestore Database**.
2. Click **Create database**.
3. **Database ID & Location:**
   - Leave Database ID as `(default)`.
   - Select your nearest region (e.g. `us-central1`, `asia-south1`, `europe-west1`). Note: Region cannot be changed later.
4. **Security Rules prompt:**
   - Select **Start in production mode** (all read/write locked until rules are applied).
   - Click **Create**.
5. **Apply Security Rules:**
   - In Firestore Database, click the **Rules** tab at the top.
   - Replace the default rules with the rules in [firestore.rules](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/firestore.rules):
   - Click **Publish**.

### Core Collections Structure
When data is written, Firestore organizes documents into:
- `users/{userId}`: Profile, role (`learner`, `admin`), streak, achievements.
- `categories/{categoryId}`: Course categories (Thinking, Communication, etc.).
- `courses/{courseId}`: Course metadata, outcomes, syllabus, status (`Published`, `Draft`).
- `courses/{courseId}/modules/{moduleId}/lessons/{lessonId}`: Reading blocks, diagrams, research references.
- `enrollments/{enrollmentId}`: Enrolled courses, completion percentage, completed lessons list.
- `activities/{activityId}`: Quizzes (multiple-choice questions) & assignments.
- `submissions/{submissionId}`: Scored quiz attempts and written responses.
- `learnerCRM/{userId}`: Private staff-only follow-up status (`Needs Attention`, `Contacted`, `Resolved`) and internal notes thread.
- `researchSources/{sourceId}`: Verified peer-reviewed citations.

---

## 5. Step-by-Step: Firebase Storage Setup

1. In the left sidebar, click **Build** > **Storage**.
2. Click **Get Started**.
3. Choose **Start in production mode** and click **Next**.
4. Select the Cloud Storage location (matches your Firestore region) and click **Done**.
5. **Apply Storage Rules:**
   - Click on the **Rules** tab in Firebase Storage.
   - Replace the rules with the content of [storage.rules](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/storage.rules).
   - Click **Publish**.

---

## 6. Connecting the Frontend (Client)

1. In the Firebase Console, click the **Project Settings** (gear icon next to Project Overview in the top left).
2. In the **General** tab, scroll down to the **Your apps** section.
3. Click the **Web** icon (`</>`).
4. **App nickname:** Enter `EduVerse Web Client`.
5. (Optional) Check "Also set up Firebase Hosting for this app".
6. Click **Register app**.
7. Firebase will display your `firebaseConfig` object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "eduverse-platform.firebaseapp.com",
     projectId: "eduverse-platform",
     storageBucket: "eduverse-platform.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef"
   };
   ```
8. In the `client/` directory of your project, create or edit `.env`:
   ```bash
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=eduverse-platform.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=eduverse-platform
   VITE_FIREBASE_STORAGE_BUCKET=eduverse-platform.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
   ```

---

## 7. Connecting the Backend (Node/Express Server)

For server-side token verification and administrative permissions:

1. In the Firebase Console, go to **Project Settings** > **Service accounts** tab.
2. Ensure **Node.js** is selected.
3. Click **Generate new private key** and confirm by clicking **Generate key**.
4. A `.json` file will download to your computer.
5. In your `server/` directory, create or edit `.env`:
   ```bash
   PORT=5000
   FIREBASE_PROJECT_ID=eduverse-platform
   FIREBASE_STORAGE_BUCKET=eduverse-platform.appspot.com
   # Paste the full minified JSON content of the downloaded service account key:
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"eduverse-platform",...}
   ```

---

## 8. Verifying Your Setup

1. Start the backend API:
   ```powershell
   cd server
   npm start
   ```
   You should see:
   `[Firebase Admin] Successfully initialized with service account.`

2. In another terminal, start the frontend client:
   ```powershell
   cd client
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. Sign up with a new email or click **Instant Demo Logins** to test both the public learner site and the admin CRM!

