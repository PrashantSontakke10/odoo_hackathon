const mongoose = require('mongoose');

const approvalRuleSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    
    // 1. First approval rule standard
    isManagerApprover: { type: Boolean, default: true }, // The expense is first approved by the employee's direct manager.

    // 2. Sequential multi-approvers
    sequence: [{
        step: Number,
        approverRole: { type: String }, // e.g., 'Finance', 'Director'
        approverUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Specific User overrides role
    }],
    
    // 3. Conditional Flow
    conditionFlow: { 
        type: String, 
        enum: ['Percentage', 'Specific', 'Hybrid', 'None'], 
        default: 'None' 
    },
    percentageRule: { type: Number, default: 0 }, // e.g. 60 for 60% approvals
    specificApprovers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // e.g. If CFO Approves

}, { timestamps: true });

module.exports = mongoose.model('ApprovalRule', approvalRuleSchema);
