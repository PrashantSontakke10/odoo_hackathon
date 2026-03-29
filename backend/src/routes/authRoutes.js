const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Helper to provide the country list + currencies mapped dynamically
router.get('/countries', authController.getCountries);

router.post('/register', authController.registerCompanyAdmin);
router.post('/login', authController.login);

module.exports = router;
