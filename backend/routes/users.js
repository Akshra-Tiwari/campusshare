const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const {
  getAllUsers, getUserById, updateUserRole, getUserResources
} = require('../controllers/userController');

router.get('/',              verifyAdmin, getAllUsers);
router.get('/:id',           verifyToken, getUserById);
router.patch('/:id/role',    verifyAdmin, updateUserRole);
router.get('/:id/resources', verifyToken, getUserResources);

module.exports = router;
