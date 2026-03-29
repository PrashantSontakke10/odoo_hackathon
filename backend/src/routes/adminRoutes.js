const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Mount global protection and restrict entire route to Admins
router.use(protect);
router.use(authorize('Admin')); 

// User Management Routes
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id/role', adminController.assignRole);
router.put('/users/:id/manager', adminController.assignManager);

// Workflow Coniguration Route
router.post('/rules', adminController.configureApprovalRules);

module.exports = router;
