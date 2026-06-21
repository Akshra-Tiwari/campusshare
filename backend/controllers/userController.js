const admin = require('../config/firebase');
const db = admin.firestore();

const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ users, total: users.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const snap = await db.collection('users').doc(req.params.id).get();
    if (!snap.exists) return res.status(404).json({ error: 'User not found' });
    res.json({ id: snap.id, ...snap.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['admin', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or student.' });
    }
    if (id === req.user.uid) {
      return res.status(400).json({ error: 'Cannot change your own role.' });
    }
    await db.collection('users').doc(id).update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.json({ success: true, message: `Role updated to ${role}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserResources = async (req, res) => {
  try {
    const snapshot = await db
      .collection('resources')
      .where('uploadedBy', '==', req.params.id)
      .orderBy('createdAt', 'desc')
      .get();
    const resources = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ resources, total: resources.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllUsers, getUserById, updateUserRole, getUserResources };
