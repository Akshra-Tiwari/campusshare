import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const getAllUsers = async () => {
  const snapshot = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Stats ──────────────────────────────────────────────────────────────────

export const getStats = async () => {
  const [usersSnap, resourcesSnap] = await Promise.all([
    getCountFromServer(collection(db, 'users')),
    getCountFromServer(collection(db, 'resources')),
  ]);
  return {
    totalUsers: usersSnap.data().count,
    totalResources: resourcesSnap.data().count,
  };
};

// ─── Leaderboard ────────────────────────────────────────────────────────────

const LEADERBOARD_SIZE = 20;

/** Top contributors ranked by uploadCount. */
export const getTopUploaders = async (topN = LEADERBOARD_SIZE) => {
  const snapshot = await getDocs(
    query(collection(db, 'users'), orderBy('uploadCount', 'desc'), limit(topN))
  );
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((u) => (u.uploadCount || 0) > 0);
};

/** Top downloaders ranked by downloadCount. */
export const getTopDownloaders = async (topN = LEADERBOARD_SIZE) => {
  const snapshot = await getDocs(
    query(collection(db, 'users'), orderBy('downloadCount', 'desc'), limit(topN))
  );
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((u) => (u.downloadCount || 0) > 0);
};
