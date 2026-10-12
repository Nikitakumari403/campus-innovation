// ─── Firestore-backed Store ────────────────────────────────────────────────
// Collections: "problems"  and  "safety"
// All functions mirror the old in-memory API so no other file needs changing.

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const PROBLEMS = 'problems';
const SAFETY   = 'safety';

// ── helper: convert Firestore doc → plain object ─────────────────────────────
const snap = (d) => ({ id: d.id, ...d.data() });

// ── Problems ─────────────────────────────────────────────────────────────────

export const getProblems = async () => {
  const q = query(collection(db, PROBLEMS), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(snap);
};

export const addProblem = async (data) => {
  const docRef = await addDoc(collection(db, PROBLEMS), {
    ...data,
    status: 'Pending',
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data, status: 'Pending', createdAt: new Date() };
};

export const updateProblem = async (id, updates) => {
  await updateDoc(doc(db, PROBLEMS, id), updates);
};

export const deleteProblem = async (id) => {
  await deleteDoc(doc(db, PROBLEMS, id));
};

// ── Safety Issues ─────────────────────────────────────────────────────────────

export const getSafetyIssues = async () => {
  const q = query(collection(db, SAFETY), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(snap);
};

export const addSafetyIssue = async (data) => {
  const docRef = await addDoc(collection(db, SAFETY), {
    ...data,
    status: 'Reported',
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data, status: 'Reported', createdAt: new Date() };
};

export const updateSafetyIssue = async (id, updates) => {
  await updateDoc(doc(db, SAFETY, id), updates);
};

export const deleteSafetyIssue = async (id) => {
  await deleteDoc(doc(db, SAFETY, id));
};
