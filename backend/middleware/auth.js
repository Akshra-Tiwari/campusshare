const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

const verifyAdmin = async (req, res, next) => {
  await verifyToken(req, res, async () => {
    try {
      const db = admin.firestore();
      const userSnap = await db.collection('users').doc(req.user.uid).get();
      if (!userSnap.exists || userSnap.data().role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admin access required' });
      }
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Server error during admin check' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
