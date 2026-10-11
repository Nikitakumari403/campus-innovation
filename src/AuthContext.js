import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase';
import { createUserProfile, getUserProfile } from './store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch role + name from Firestore
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile) {
          setUser({ uid: firebaseUser.uid, name: profile.name, email: profile.email, role: profile.role });
        } else {
          // Profile not found — sign out to avoid broken state
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    // Firebase Auth handles credential check; profile loaded by onAuthStateChanged
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name, email, password, role) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Save extra info (name, role) to Firestore
    await createUserProfile(cred.user.uid, { name, email: email.toLowerCase(), role });
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
