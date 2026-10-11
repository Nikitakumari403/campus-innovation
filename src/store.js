// ─── Firebase Firestore data store ──────────────────────────────────────────
// Collections:
//   "problems"     — campus problems submitted by students
//   "users"        — user profiles (name, role)
//   "safetyIssues" — safety issue reports

import {
  collection, doc,
  addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/* ══════════════════════════════════════════════════════
   USER PROFILES  (stored in Firestore "users" collection)
══════════════════════════════════════════════════════ */

export const createUserProfile = async (uid, { name, email, role }) => {
  await setDoc(doc(db, 'users', uid), { uid, name, email, role });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

/* ══════════════════════════════════════════════════════
   PROBLEMS  (stored in Firestore "problems" collection)
══════════════════════════════════════════════════════ */

export const getProblems = async () => {
  const q    = query(collection(db, 'problems'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addProblem = async (problem) => {
  const ref = await addDoc(collection(db, 'problems'), {
    ...problem,
    status:    'Pending',
    solution:  '',
    solvedBy:  '',
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateProblem = async (id, changes) => {
  await updateDoc(doc(db, 'problems', id), changes);
};

export const deleteProblem = async (id) => {
  await deleteDoc(doc(db, 'problems', id));
};

/* ══════════════════════════════════════════════════════
   SAFETY ISSUES  (stored in Firestore "safetyIssues" collection)
══════════════════════════════════════════════════════ */

export const getSafetyIssues = async () => {
  const q    = query(collection(db, 'safetyIssues'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addSafetyIssue = async (issue) => {
  const ref = await addDoc(collection(db, 'safetyIssues'), {
    ...issue,
    status:    'Reported',
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateSafetyIssue = async (id, changes) => {
  await updateDoc(doc(db, 'safetyIssues', id), changes);
};

export const deleteSafetyIssue = async (id) => {
  await deleteDoc(doc(db, 'safetyIssues', id));
};
