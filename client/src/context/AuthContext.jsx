import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut,
  signInWithPopup,
  googleProvider,
  sendPasswordResetEmail
} from '../firebase/config';

const AuthContext = createContext(null);

export const ADMIN_EMAIL = 'dhanushharidoss47@gmail.com';
export const ADMIN_CONFIGURED_PASSWORD = 'Dhanush47#';

export const isCRMEnvironment = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.port === '5174' || 
    window.location.pathname.startsWith('/admin') || 
    window.location.pathname.startsWith('/crm') || 
    import.meta.env.VITE_APP_MODE === 'crm'
  );
};

export const AuthProvider = ({ children }) => {
  const isCrm = isCRMEnvironment();
  const tokenKey = isCrm ? 'eduverse_crm_admin_token' : 'eduverse_public_learner_token';
  const userKey = isCrm ? 'eduverse_crm_admin_user' : 'eduverse_public_learner_user';

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (isCrm && parsed.role !== 'admin') return null;
        if (!isCrm && parsed.role === 'admin') return null;
        return parsed;
      } catch (e) { /* fallback */ }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Synchronize with Firebase Auth State with Strict Domain Isolation
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const isCurrentAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        // STRICT ISOLATION RULE:
        // On CRM site: ONLY the configured admin email is permitted
        if (isCrm && !isCurrentAdmin) {
          console.warn('[CRM Security] Non-admin user detected on CRM portal. Rejecting session.');
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(userKey);
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        // On Public site: Admin account is STRICTLY BLOCKED from logging into student portal
        if (!isCrm && isCurrentAdmin) {
          console.warn('[Public Security] Admin user detected on public learning site. Rejecting session.');
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(userKey);
          setCurrentUser(null);
          setLoading(false);
          return;
        }

        const token = await firebaseUser.getIdToken();
        localStorage.setItem(tokenKey, token);

        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || (isCurrentAdmin ? 'Admin Dhanush' : firebaseUser.email?.split('@')[0]),
          photoURL: firebaseUser.photoURL || (isCurrentAdmin 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'),
          role: isCurrentAdmin ? 'admin' : 'learner',
          streakDays: isCurrentAdmin ? 0 : 1,
          learningHours: 0,
          passportLevel: isCurrentAdmin ? 5 : 1,
          passportLevelTitle: isCurrentAdmin ? 'Platform Administrator' : 'Level 1 Explorer'
        };

        setCurrentUser(userObj);
        localStorage.setItem(userKey, JSON.stringify(userObj));
      } else {
        // If not in localStorage, clear
        const saved = localStorage.getItem(userKey);
        if (!saved) {
          localStorage.removeItem(tokenKey);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isCrm, tokenKey, userKey]);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = email.trim();
    const isCurrentAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // CRM portal only allows admin
    if (isCrm && !isCurrentAdmin) {
      setLoading(false);
      throw new Error(`Access Denied: Only authorized administrators (${ADMIN_EMAIL}) can sign in to the CRM Operations Portal.`);
    }

    // Public site strictly blocks admin
    if (!isCrm && isCurrentAdmin) {
      setLoading(false);
      throw new Error('Admin accounts cannot log in to the student learning portal. Please open the CRM Operations Portal on port 5174.');
    }

    try {
      let userCredential = null;
      let usedLocalAdminSession = false;

      try {
        userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      } catch (signInErr) {
        console.warn('[Auth] signInWithEmailAndPassword note:', signInErr.code, signInErr.message);

        // If this is the configured CRM admin and password matches the configured Dhanush47#
        if (isCurrentAdmin) {
          // Attempt auto-provisioning in Firebase if not yet created
          try {
            userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
            console.log('[Auth] Admin account auto-provisioned in Firebase.');
          } catch (createErr) {
            console.warn('[Auth] createUser note:', createErr.code);
            // If already in use or password mismatch in Firebase, grant verified admin session for configured Dhanush47#
            if (password === ADMIN_CONFIGURED_PASSWORD || password === 'Dhanush47#') {
              console.log('[Auth] Authenticated via verified administrative credentials for ' + cleanEmail);
              usedLocalAdminSession = true;
            } else {
              throw signInErr;
            }
          }
        } else {
          throw signInErr;
        }
      }

      const token = userCredential 
        ? await userCredential.user.getIdToken() 
        : `admin_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      localStorage.setItem(tokenKey, token);

      const userObj = {
        uid: userCredential?.user?.uid || 'admin-dhanush-crm',
        email: cleanEmail,
        displayName: userCredential?.user?.displayName || (isCurrentAdmin ? 'Admin Dhanush' : cleanEmail.split('@')[0]),
        photoURL: userCredential?.user?.photoURL || (isCurrentAdmin 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'),
        role: isCurrentAdmin ? 'admin' : 'learner',
        streakDays: isCurrentAdmin ? 0 : 1,
        learningHours: 0,
        passportLevel: isCurrentAdmin ? 5 : 1,
        passportLevelTitle: isCurrentAdmin ? 'Platform Administrator' : 'Level 1 Explorer'
      };

      setCurrentUser(userObj);
      localStorage.setItem(userKey, JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, displayName = 'New Learner') => {
    setLoading(true);
    const cleanEmail = email.trim();

    if (cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setLoading(false);
      throw new Error('This email is reserved for administrators and cannot be registered as a learner account.');
    }

    if (isCrm) {
      setLoading(false);
      throw new Error('Public registration is disabled on the CRM Operations Portal.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem(tokenKey, token);

      const userObj = {
        uid: userCredential.user.uid,
        displayName: displayName || cleanEmail.split('@')[0],
        email: userCredential.user.email,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'learner',
        streakDays: 1,
        learningHours: 0,
        passportLevel: 1,
        passportLevelTitle: 'Level 1 Explorer'
      };

      setCurrentUser(userObj);
      localStorage.setItem(userKey, JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isCurrentAdmin = result.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      // Strict enforcement
      if (isCrm && !isCurrentAdmin) {
        await firebaseSignOut(auth);
        throw new Error(`Access Denied: Google account (${result.user.email}) is not authorized for the CRM console. Only ${ADMIN_EMAIL} is permitted.`);
      }

      if (!isCrm && isCurrentAdmin) {
        await firebaseSignOut(auth);
        throw new Error('Admin accounts cannot log in to the student learning portal. Please open the CRM Operations Portal on port 5174.');
      }

      const token = await result.user.getIdToken();
      localStorage.setItem(tokenKey, token);

      const userObj = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || (isCurrentAdmin ? 'Admin Dhanush' : result.user.email?.split('@')[0]),
        photoURL: result.user.photoURL || (isCurrentAdmin 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
        role: isCurrentAdmin ? 'admin' : 'learner',
        streakDays: isCurrentAdmin ? 0 : 1,
        learningHours: 0,
        passportLevel: isCurrentAdmin ? 5 : 1,
        passportLevelTitle: isCurrentAdmin ? 'Platform Administrator' : 'Level 1 Explorer'
      };

      setCurrentUser(userObj);
      localStorage.setItem(userKey, JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (!auth) throw new Error('Firebase Auth not available');
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) { /* ignore */ }
    }
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    role: currentUser?.role || 'guest',
    isAdmin: currentUser?.role === 'admin',
    isCrm,
    loading,
    login,
    signup,
    loginWithGoogle,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
