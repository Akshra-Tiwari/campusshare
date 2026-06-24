const admin = require('../config/firebase');
const cloudinary = require('../config/cloudinary');
const db = admin.firestore();

const getResources = async (req, res) => {
  try {
    const { branch, semester, type, subject, limit = 20 } = req.query;
    let query = db.collection('resources').orderBy('createdAt', 'desc');

    if (branch)   query = query.where('branch', '==', branch);
    if (semester) query = query.where('semester', '==', Number(semester));
    if (type)     query = query.where('type', '==', type);
    if (subject)  query = query.where('subject', '==', subject);

    query = query.limit(Number(limit));
    const snapshot = await query.get();
    const resources = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ resources, total: resources.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getResourceById = async (req, res) => {
  try {
    const snap = await db.collection('resources').doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Resource not found' });
    res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const snap = await db.collection('resources').doc(id).get();
    if (!snap.exists) return res.status(404).json({ error: 'Resource not found' });

    const resource = snap.data();
    const isOwner = resource.uploadedBy === req.user.uid;

    const userSnap = await db.collection('users').doc(req.user.uid).get();
    const isAdmin = userSnap.exists && userSnap.data().role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }

    await db.collection('resources').doc(id).delete();

    // Best-effort cleanup of the Cloudinary file(s). Resource deletion should
    // not fail if Cloudinary cleanup fails — the Firestore doc is already gone.
    const filesToDelete = [];
    if (resource.filePath) filesToDelete.push(resource.filePath);
    if (Array.isArray(resource.previousVersions)) {
      resource.previousVersions.forEach((v) => {
        if (v.filePath) filesToDelete.push(v.filePath);
      });
    }

    await Promise.allSettled(
      filesToDelete.map((publicId) =>
        cloudinary.uploader.destroy(publicId, { resource_type: 'auto', invalidate: true })
      )
    );

    if (resource.uploadedBy) {
      await db.collection('users').doc(resource.uploadedBy).update({
        uploadCount: admin.firestore.FieldValue.increment(-1),
      });
    }

    res.json({ success: true, message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [usersSnap, resourcesSnap] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('resources').count().get(),
    ]);
    res.json({
      totalUsers: usersSnap.data().count,
      totalResources: resourcesSnap.data().count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getResources, getResourceById, deleteResource, getStats };
