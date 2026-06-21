const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  getResources, getResourceById, deleteResource, getStats
} = require('../controllers/resourceController');

router.get('/',        getResources);
router.get('/stats',   getStats);
router.get('/:id',     getResourceById);
router.delete('/:id',  verifyToken, deleteResource);

module.exports = router;
