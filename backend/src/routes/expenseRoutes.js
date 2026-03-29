const express = require('express');
const router = express.Router();
const multer = require('multer');
const expenseController = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const upload = multer({ dest: 'uploads/' });

// Require authentication for all expense routes
router.use(protect);

// Submission & View
router.post('/', expenseController.submitExpense);
router.get('/', expenseController.getExpenses);

// Approval System (Restricted to Managers and Admins)
router.put('/:id/action', authorize('Manager', 'Admin'), expenseController.processAction);

// Optional Addon: OCR Extraction API
router.post('/ocr', authorize('Employee', 'Admin'), upload.single('receipt'), expenseController.ocrExtract);

module.exports = router;
