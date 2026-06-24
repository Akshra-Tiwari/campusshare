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
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadToCloudinary } from './cloudinary';

// ─── Upload (Cloudinary for files, Firestore for metadata) ────────────────────

export const uploadResource = async (file, metadata, userId, onProgress) => {
  if (onProgress) onProgress(5);

  const cloudinaryResult = await uploadToCloudinary(file, (pct) => {
    // Cloudinary upload is 0-80% of total progress; remaining 20% is Firestore write
    if (onProgress) onProgress(Math.round(pct * 0.8));
  });

  if (onProgress) onProgress(85);

  const docRef = await addDoc(collection(db, 'resources'), {
    ...metadata,
    fileURL: cloudinaryResult.url,
    filePath: cloudinaryResult.publicId,
    fileType: file.type,
    fileSize: file.size,
    fileName: file.name,
    uploadedBy: userId,
    downloads: 0,
    averageRating: 0,
    totalRatings: 0,
    ratingSum: 0,
    version: 1,
    previousVersions: [],
    flagCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (onProgress) onProgress(95);

  await updateDoc(doc(db, 'users', userId), {
    uploadCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  if (onProgress) onProgress(100);

  return { id: docRef.id, downloadURL: cloudinaryResult.url };
};

/**
 * Uploads a new version of an existing resource. The old file's metadata
 * is archived into `previousVersions` so history is preserved.
 */
export const uploadNewVersion = async (resourceId, file, userId, onProgress) => {
  const resourceRef = doc(db, 'resources', resourceId);
  const snap = await getDoc(resourceRef);
  if (!snap.exists()) throw new Error('Resource not found.');
  const current = snap.data();

  if (onProgress) onProgress(5);
  const cloudinaryResult = await uploadToCloudinary(file, (pct) => {
    if (onProgress) onProgress(Math.round(pct * 0.85));
  });
  if (onProgress) onProgress(90);

  const archivedVersion = {
    version: current.version || 1,
    fileURL: current.fileURL,
    filePath: current.filePath,
    fileName: current.fileName,
    fileSize: current.fileSize,
    fileType: current.fileType,
    archivedAt: new Date().toISOString(),
  };

  await updateDoc(resourceRef, {
    fileURL: cloudinaryResult.url,
    filePath: cloudinaryResult.publicId,
    fileType: file.type,
    fileSize: file.size,
    fileName: file.name,
    version: (current.version || 1) + 1,
    previousVersions: [...(current.previousVersions || []), archivedVersion],
    updatedAt: serverTimestamp(),
  });

  if (onProgress) onProgress(100);
  return { success: true };
};

// ─── Fetch (one-time) ───────────────────────────────────────────────────────

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

// ─── Real-time listeners ────────────────────────────────────────────────────

/**
 * Subscribes to live updates for the resource list matching filters.
 * Calls callback(resources) on every change. Returns an unsubscribe function.
 */
export const subscribeToResources = (filters = {}, pageSize = 12, callback) => {
  let q = collection(db, 'resources');
  const constraints = [];

  if (filters.branch)   constraints.push(where('branch', '==', filters.branch));
  if (filters.semester) constraints.push(where('semester', '==', Number(filters.semester)));
  if (filters.type)     constraints.push(where('type', '==', filters.type));
  if (filters.subject)  constraints.push(where('subject', '==', filters.subject));

  constraints.push(orderBy('createdAt', 'desc'));
  constraints.push(limit(pageSize));

  const unsubscribe = onSnapshot(
    query(q, ...constraints),
    (snapshot) => {
      const resources = [];
      snapshot.forEach((d) => resources.push({ id: d.id, ...d.data() }));
      callback(resources, null);
    },
    (error) => callback(null, error)
  );

  return unsubscribe;
};

/** Subscribes to live updates for a single resource (rating/download count changes in real time). */
export const subscribeToResource = (id, callback) => {
  const unsubscribe = onSnapshot(
    doc(db, 'resources', id),
    (snap) => {
      if (snap.exists()) callback({ id: snap.id, ...snap.data() }, null);
      else callback(null, new Error('Resource not found'));
    },
    (error) => callback(null, error)
  );
  return unsubscribe;
};

// ─── Delete ─────────────────────────────────────────────────────────────────

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

// ─── Flagging ───────────────────────────────────────────────────────────────

export const flagResource = async (resourceId, userId, reason) => {
  const flagRef = doc(db, 'flags', `${resourceId}_${userId}`);
  const existing = await getDoc(flagRef);
  if (existing.exists()) {
    throw new Error('You have already reported this resource.');
  }

  await runTransaction(db, async (transaction) => {
    const resourceRef = doc(db, 'resources', resourceId);
    const resourceSnap = await transaction.get(resourceRef);
    if (!resourceSnap.exists()) throw new Error('Resource not found.');

    transaction.set(flagRef, {
      resourceId,
      userId,
      reason,
      createdAt: serverTimestamp(),
    });

    transaction.update(resourceRef, {
      flagCount: increment(1),
    });
  });
};

export const getFlaggedResources = async () => {
  const snapshot = await getDocs(
    query(collection(db, 'resources'), where('flagCount', '>', 0), orderBy('flagCount', 'desc'))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Ratings ────────────────────────────────────────────────────────────────

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

// ─── Per-user resources ─────────────────────────────────────────────────────

export const getUserResources = async (userId) => {
  const snapshot = await getDocs(
    query(collection(db, 'resources'), where('uploadedBy', '==', userId), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ─── Search ─────────────────────────────────────────────────────────────────

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
