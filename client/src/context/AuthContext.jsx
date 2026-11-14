import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut,
  signInWithPopup,
  googleProvider
} from '../firebase/config';

const AuthContext = createContext(null);

export const ADMIN_EMAIL = 'dhanushharidoss47@gmail.com';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('eduverse_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Synchronize with Firebase Auth State
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('eduverse_token', token);

        const isAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || (isAdmin ? 'Admin Dhanush' : firebaseUser.email?.split('@')[0]),
          photoURL: firebaseUser.photoURL || (isAdmin 
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
            : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'),
          role: isAdmin ? 'admin' : 'learner',
          streakDays: 7,
          learningHours: 24.5,
          passportLevel: isAdmin ? 5 : 2,
          passportLevelTitle: isAdmin ? 'Platform Administrator' : 'Level 2 Learner'
        };

        setCurrentUser(userObj);
        localStorage.setItem('eduverse_user', JSON.stringify(userObj));
      } else {
        localStorage.removeItem('eduverse_token');
        localStorage.removeItem('eduverse_user');
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const cleanEmail = email.trim();
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      } catch (signInErr) {
        // If this is the configured CRM admin and the account has not been provisioned in Firebase yet, auto-create it!
        if (
          cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
          (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential' || signInErr.code === 'auth/invalid-login-credentials')
        ) {
          console.log('[Auth] Admin account not yet created in Firebase project. Creating CRM admin account automatically...');
          userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        } else {
          throw signInErr;
        }
      }

      const token = await userCredential.user.getIdToken();
      localStorage.setItem('eduverse_token', token);

      const isAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const userObj = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || (isAdmin ? 'Admin Dhanush' : userCredential.user.email?.split('@')[0]),
        photoURL: userCredential.user.photoURL || (isAdmin 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'),
        role: isAdmin ? 'admin' : 'learner',
        streakDays: 7,
        learningHours: 24.5,
        passportLevel: isAdmin ? 5 : 2,
        passportLevelTitle: isAdmin ? 'Platform Administrator' : 'Level 2 Learner'
      };

      setCurrentUser(userObj);
      localStorage.setItem('eduverse_user', JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, displayName = 'New Learner') => {
    setLoading(true);
    const cleanEmail = email.trim();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('eduverse_token', token);

      const isAdmin = cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const userObj = {
        uid: userCredential.user.uid,
        displayName: displayName || (isAdmin ? 'Admin Dhanush' : cleanEmail.split('@')[0]),
        email: userCredential.user.email,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: isAdmin ? 'admin' : 'learner',
        streakDays: 1,
        learningHours: 0,
        passportLevel: 1,
        passportLevelTitle: 'Level 1 Explorer'
      };

      setCurrentUser(userObj);
      localStorage.setItem('eduverse_user', JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('eduverse_token', token);

      const isAdmin = result.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const userObj = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName || (isAdmin ? 'Admin Dhanush' : result.user.email?.split('@')[0]),
        photoURL: result.user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        role: isAdmin ? 'admin' : 'learner',
        streakDays: 7,
        learningHours: 24.5,
        passportLevel: isAdmin ? 5 : 2,
        passportLevelTitle: isAdmin ? 'Platform Administrator' : 'Level 2 Learner'
      };

      setCurrentUser(userObj);
      localStorage.setItem('eduverse_user', JSON.stringify(userObj));
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (auth) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem('eduverse_token');
    localStorage.removeItem('eduverse_user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    role: currentUser?.role || 'guest',
    isAdmin: currentUser?.role === 'admin',
    loading,
    login,
    signup,
    loginWithGoogle,
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
