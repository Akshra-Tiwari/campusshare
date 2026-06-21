import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  runTransaction,
  getCountFromServer,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ─── File helpers (Base64 — no Firebase Storage needed, works on free Spark plan) ──

const MAX_BASE64_SIZE = 700 * 1024; // ~700KB raw file (Firestore doc cap is 1MB)

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // data:mime;base64,xxxx
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

// ─── Resources ────────────────────────────────────────────────────────────────

export const uploadResource = async (file, metadata, userId, onProgress) => {
  if (file.size > MAX_BASE64_SIZE) {
    throw new Error(
      `File is too large (${(file.size / 1024).toFixed(0)}KB). Max allowed is ${(MAX_BASE64_SIZE / 1024).toFixed(0)}KB on the free plan.`
    );
  }

  if (onProgress) onProgress(20);
  const base64Data = await fileToBase64(file);
  if (onProgress) onProgress(60);

  const docRef = await addDoc(collection(db, 'resources'), {
    ...metadata,
    fileURL: base64Data,
    filePath: null,
    fileType: file.type,
    fileSize: file.size,
    fileName: file.name,
    uploadedBy: userId,
    downloads: 0,
    averageRating: 0,
    totalRatings: 0,
    ratingSum: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (onProgress) onProgress(90);

  await updateDoc(doc(db, 'users', userId), {
    uploadCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  if (onProgress) onProgress(100);

  return { id: docRef.id, downloadURL: base64Data };
};

export const getResources = async (filters = {}, pageSize = 12, lastDoc = null) => {
  let q = collection(db, 'resources');
  const constraints = [];

  if (filters.branch)   constraints.push(where('branch', '==', filters.branch));
  if (filters.semester) constraints.push(where('semester', '==', Number(filters.semester)));
  if (filters.type)     constraints.push(where('type', '==', filters.type));
  if (filters.subject)  constraints.push(where('subject', '==', filters.subject));

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(pageSize));

  if (lastDoc) constraints.push(startAfter(lastDoc));

  const snapshot = await getDocs(query(q, ...constraints));
  const resources = [];
  snapshot.forEach((d) => resources.push({ id: d.id, ...d.data() }));

  return {
    resources,
    lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    hasMore: snapshot.docs.length === pageSize,
  };
};

export const getResourceById = async (id) => {
  const snap = await getDoc(doc(db, 'resources', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

export const deleteResource = async (resourceId, filePath, uploadedBy) => {
  await deleteDoc(doc(db, 'resources', resourceId));
  if (uploadedBy) {
    await updateDoc(doc(db, 'users', uploadedBy), {
      uploadCount: increment(-1),
    });
  }
};

export const incrementDownload = async (resourceId, userId) => {
  await updateDoc(doc(db, 'resources', resourceId), {
    downloads: increment(1),
  });
  if (userId) {
    await updateDoc(doc(db, 'users', userId), {
      downloadCount: increment(1),
    });
  }
};

// ─── Ratings ──────────────────────────────────────────────────────────────────

export const submitRating = async (resourceId, userId, stars) => {
  await runTransaction(db, async (transaction) => {
    const resourceRef = doc(db, 'resources', resourceId);
    const ratingRef   = doc(db, 'ratings', `${resourceId}_${userId}`);

    const resourceSnap = await transaction.get(resourceRef);
    const ratingSnap   = await transaction.get(ratingRef);

    if (!resourceSnap.exists()) throw new Error('Resource not found');

    const data = resourceSnap.data();
    let { ratingSum = 0, totalRatings = 0 } = data;

    if (ratingSnap.exists()) {
      const prev = ratingSnap.data().stars;
      ratingSum = ratingSum - prev + stars;
    } else {
      totalRatings += 1;
      ratingSum += stars;
    }

    const averageRating = totalRatings > 0 ? ratingSum / totalRatings : 0;

    transaction.set(ratingRef, {
      resourceId,
      userId,
      stars,
      updatedAt: serverTimestamp(),
    });

    transaction.update(resourceRef, {
      ratingSum,
      totalRatings,
      averageRating: Math.round(averageRating * 10) / 10,
      updatedAt: serverTimestamp(),
    });
  });
};

export const getUserRating = async (resourceId, userId) => {
  const snap = await getDoc(doc(db, 'ratings', `${resourceId}_${userId}`));
  return snap.exists() ? snap.data().stars : 0;
};

// ─── Users ────────────────────────────────────────────────────────────────────

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

export const getUserResources = async (userId) => {
  const snapshot = await getDocs(
    query(collection(db, 'resources'), where('uploadedBy', '==', userId), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchResources = async (searchTerm, filters = {}) => {
  const constraints = [];

  if (filters.branch)   constraints.push(where('branch', '==', filters.branch));
  if (filters.semester) constraints.push(where('semester', '==', Number(filters.semester)));
  if (filters.type)     constraints.push(where('type', '==', filters.type));

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(50));

  const snapshot = await getDocs(query(collection(db, 'resources'), ...constraints));
  const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (!searchTerm) return all;

  const term = searchTerm.toLowerCase();
  return all.filter(
    (r) =>
      r.title?.toLowerCase().includes(term) ||
      r.subject?.toLowerCase().includes(term) ||
      r.description?.toLowerCase().includes(term) ||
      r.uploaderName?.toLowerCase().includes(term)
  );
};

// ─── Stats ────────────────────────────────────────────────────────────────────

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
