import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const bookmarkId = (userId, resourceId) => `${userId}_${resourceId}`;

export const addBookmark = async (userId, resourceId) => {
  await setDoc(doc(db, 'bookmarks', bookmarkId(userId, resourceId)), {
    userId,
    resourceId,
    createdAt: serverTimestamp(),
  });
};

export const removeBookmark = async (userId, resourceId) => {
  await deleteDoc(doc(db, 'bookmarks', bookmarkId(userId, resourceId)));
};

export const isBookmarked = async (userId, resourceId) => {
  const snap = await getDoc(doc(db, 'bookmarks', bookmarkId(userId, resourceId)));
  return snap.exists();
};

export const getUserBookmarks = async (userId) => {
  const snapshot = await getDocs(
    query(collection(db, 'bookmarks'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map((d) => d.data().resourceId);
};

/** Real-time subscription to a single bookmark's existence (for instant UI toggling). */
export const subscribeToBookmark = (userId, resourceId, callback) => {
  if (!userId) {
    callback(false);
    return () => {};
  }
  const unsubscribe = onSnapshot(doc(db, 'bookmarks', bookmarkId(userId, resourceId)), (snap) => {
    callback(snap.exists());
  });
  return unsubscribe;
};
