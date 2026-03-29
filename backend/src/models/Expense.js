const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
    amountOriginal: { type: Number, required: true },
    currencyOriginal: { type: String, required: true },
    amountCompanyCurrency: { type: Number, required: true }, // Normalized via exchange rate API
    
    category: { type: String },
    description: { type: String },
    date: { type: Date, required: true },
    receiptUrl: { type: String }, // Used for OCR
    ocrData: { type: mongoose.Schema.Types.Mixed }, // Parsed raw data (lines, items, restaurant, etc.)
    
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    
    // Approval Workflow Engine Properties
    currentApprovalStep: { type: Number, default: 1 },
    approvals: [{
        approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['Approved', 'Rejected'] },
        comments: { type: String },
        date: { type: Date, default: Date.now }
    }],
    waitingOnRole: { type: String } // Which role/user sequence is the expense waiting on
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
