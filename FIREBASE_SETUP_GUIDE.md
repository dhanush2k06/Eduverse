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

> **Hybrid Mode Advantage:** The EduVerse server includes built-in hybrid support. If server-side service account credentials are not configured or in local development, it automatically operates in local state mode with seed data while frontend authentication connects directly to live Firebase Auth!

---

## 2. Your Project Credentials

The project is currently configured to connect to your live Firebase project **`eduverse-e0eb4`**:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAUQ24yVn6M6NhCJHL19fw8YYkmkPYV3mo",
  authDomain: "eduverse-e0eb4.firebaseapp.com",
  projectId: "eduverse-e0eb4",
  storageBucket: "eduverse-e0eb4.firebasestorage.app",
  messagingSenderId: "942069506724",
  appId: "1:942069506724:web:577b70a0fbb11096513c31",
  measurementId: "G-N5HNSHQYX2"
};
```

---

## 3. Firebase Console Configuration Steps

To ensure authentication, database, and storage work smoothly from your Firebase Console:

### Step 3.1: Enable Authentication Providers
1. Open the [Firebase Console](https://console.firebase.google.com/) and select `eduverse-e0eb4`.
2. In the left navigation, click **Build** > **Authentication**.
3. Under the **Sign-in method** tab:
   - **Email/Password:**
     - Click **Email/Password**.
     - Toggle **Enable** to **ON** (leave "Email link" disabled).
     - Click **Save**.
   - **Google Sign-In:**
     - Click **Google**.
     - Toggle **Enable** to **ON**.
     - Select your project support email and click **Save**.
4. Under the **Settings** tab:
   - Verify that `localhost` is present in **Authorized domains**.

### Step 3.2: Enable Cloud Firestore
1. In the left sidebar, click **Build** > **Firestore Database**.
2. If not already created, click **Create database**.
3. Select **Production mode** and choose your region (e.g., `us-central1` or `asia-south1`).
4. Apply the security rules by navigating to the **Rules** tab, copying the contents of [`firestore.rules`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/firestore.rules), and clicking **Publish**.

### Step 3.3: Enable Firebase Storage
1. In the left sidebar, click **Build** > **Storage**.
2. Click **Get Started**, choose **Production mode**, and click **Done**.
3. In the **Rules** tab, replace the default rules with the contents of [`storage.rules`](file:///c:/Users/dhanu/OneDrive/Desktop/EduTech/storage.rules) and click **Publish**.

---

## 4. Administrator Setup

The CRM portal (`http://localhost:5174`) is secured for administrator access:

- **Admin Email:** `dhanushharidoss47@gmail.com`
- **Initial Password:** `Dhanush47#`

### Automatic Provisioning
When you log in to the CRM portal (`http://localhost:5174/login`) for the first time with this email and password, the system **automatically provisions the user in Firebase Authentication** if it does not already exist.

Alternatively, you can manually create the user in the Firebase Console under **Authentication** > **Users** > **Add user**.

---

## 5. Running the Application

Start all three services using the root npm commands:

```powershell
# Terminal 1: Backend REST API
npm run start:server

# Terminal 2: Public Learner Site (Port 5173)
npm run start:public

# Terminal 3: Learner CRM Portal (Port 5174)
npm run start:crm
```

- Visit `http://localhost:5173` to explore courses, register as a learner, or test quizzes.
- Visit `http://localhost:5174` to log into the admin CRM and manage learners, courses, and operations.
