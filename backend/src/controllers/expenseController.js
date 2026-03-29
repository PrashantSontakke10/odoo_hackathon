const Expense = require('../models/Expense');
const ApprovalRule = require('../models/ApprovalRule');
const User = require('../models/User');
const Company = require('../models/Company');
const ocrService = require('../services/ocrService');
const currencyService = require('../services/currencyService');

exports.submitExpense = async (req, res, next) => {
    try {
        const { amountOriginal, currencyOriginal, category, description, date, receiptUrl } = req.body;
        
        const companyId = req.user.company;
        const companyDoc = await Company.findById(companyId);
        if (!companyDoc) return res.status(404).json({ message: "Company not found" });

        const amountCompanyCurrency = await currencyService.convertCurrency(
            amountOriginal, 
            currencyOriginal, 
            companyDoc.currency
        );

        const expense = await Expense.create({
            employee: req.user._id,
            company: companyId,
            amountOriginal,
            currencyOriginal,
            amountCompanyCurrency,
            category,
            description,
            date,
            receiptUrl,
            currentApprovalStep: 0, 
            status: 'Pending'
        });

        res.status(201).json(expense);
    } catch (error) {
        next(error);
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        let query = { company: req.user.company };
        if (req.user.role === 'Employee') {
            query.employee = req.user._id; 
        }

        let expenses = await Expense.find(query).populate('employee', 'name email role manager');

        // Critical Filtering Handling PDF Sequential Array vs Conditional Math Thresholds
        if (req.user.role === 'Manager' || req.user.role === 'Finance' || req.user.role === 'Director') {
            const rule = await ApprovalRule.findOne({ company: req.user.company });
            const myTeamIds = (await User.find({ manager: req.user._id }).select('_id')).map(u => u._id.toString());
            
            expenses = expenses.filter(exp => {
                // Return true if it's my own expense node
                if (exp.employee._id.toString() === req.user._id.toString()) return true;

                // Condition Array Evaluation
                if (exp.status === 'Pending') {
                    
                    let offsetStep = 0;
                    if (rule && rule.isManagerApprover) {
                        // PDF RULE: "First approved by his manager if IS MANAGER APPROVER field is checked."
                        if (exp.currentApprovalStep === 0) {
                            if (myTeamIds.includes(exp.employee._id.toString())) return true;
                            // If it's on step 0, no one else is permitted to see it yet!
                            return false; 
                        }
                        offsetStep = 1;
                    }

                    // If we passed the direct manager fallback constraint (or there wasn't one)
                    if (exp.currentApprovalStep >= offsetStep) {
                        
                        // Scenario 1: PDF "Specific Request" (e.g., CFO VIP Override)
                        // Target users defined in specificApprovers can ALWAYS see it once past the manager lock
                        if (rule && (rule.conditionFlow === 'Specific' || rule.conditionFlow === 'Hybrid')) {
                            if (rule.specificApprovers && rule.specificApprovers.map(id=>id.toString()).includes(req.user._id.toString())) {
                                return true; 
                            }
                        }

                        // Scenario 2: PDF "Percentage Rule" (e.g., 60% of assigned approvers)
                        // Instead of moving sequentially, the "multiple approvers" become a concurrent voting pool!
                        if (rule && (rule.conditionFlow === 'Percentage' || rule.conditionFlow === 'Hybrid')) {
                             const myRoleIndex = rule.sequence.findIndex(s => s.approverRole === req.user.role);
                             if (myRoleIndex !== -1) {
                                  // As long as I haven't already approved it, show it in my pending vault
                                  const alreadyVoted = exp.approvals.some(a => a.approver.toString() === req.user._id.toString());
                                  if (!alreadyVoted) return true;
                             }
                        } 
                        
                        // Scenario 3: PDF "Strict Sequence" (e.g., Step 1 -> Finance, Step 2 -> Director)
                        else if (rule && (rule.conditionFlow === 'None' || !rule.conditionFlow)) {
                            if (rule.sequence && rule.sequence.length > 0) {
                                const calculatedIndex = exp.currentApprovalStep - offsetStep;
                                if (calculatedIndex >= 0 && calculatedIndex < rule.sequence.length) {
                                     const expectedRole = rule.sequence[calculatedIndex].approverRole;
                                     if (req.user.role === expectedRole) {
                                         return true;
                                     }
                                }
                            }
                        }
                    }
                }
                
                // Allow history view if I've previously interacted with it safely
                const hasMyAction = exp.approvals.some(a => a.approver.toString() === req.user._id.toString());
                if (hasMyAction) return true;

                return false;
            });
        }
        res.json(expenses);
    } catch (error) {
        next(error);
    }
};

exports.processAction = async (req, res, next) => {
    try {
        const { status, comments } = req.body; 
        const expense = await Expense.findById(req.params.id);
        
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        if (expense.status !== 'Pending') return res.status(400).json({ message: 'Expense is already finalized' });
        
        // Push mathematical voting trace
        expense.approvals.push({
            approver: req.user._id,
            status,
            comments,
            date: new Date()
        });

        const rule = await ApprovalRule.findOne({ company: req.user.company });

        // PDF Rejection Handling: Any Rejection instantly fails the entire matrix
        if (status === 'Rejected') {
            expense.status = 'Rejected';
        } 
        else if (req.user.role === 'Admin') {
            // Global Admin structural override
            expense.status = status; 
        } 
        else {
            let offsetStep = 0;
            if (rule && rule.isManagerApprover) offsetStep = 1;

            // Scenario A: Check if this was just the Direct Manager unblocking the first required PDF step
            if (rule && rule.isManagerApprover && expense.currentApprovalStep === 0) {
                 expense.currentApprovalStep = 1; // Unlocks it for the rest of evaluating sequence
                 
                 // If there's literally no rules left, auto-approve it
                 if ((!rule.sequence || rule.sequence.length === 0) && (!rule.conditionFlow || rule.conditionFlow === 'None')) {
                     expense.status = 'Approved'; 
                 }
            } 
            else {
                // Post-Manager Conditional Operations Engine
                let isAutoApproved = false;

                // PDF Specific Rule: VIP Match triggers Instant Auto-Approve bypassing arrays
                if (rule && (rule.conditionFlow === 'Specific' || rule.conditionFlow === 'Hybrid')) {
                    if (rule.specificApprovers && rule.specificApprovers.map(id=>id.toString()).includes(req.user._id.toString())) {
                        isAutoApproved = true; 
                    }
                }

                if (isAutoApproved) {
                    expense.status = 'Approved';
                } 
                else {
                    // PDF Percentage Rule Evaluation: Group Consensus Math
                    if (rule && (rule.conditionFlow === 'Percentage' || rule.conditionFlow === 'Hybrid')) {
                        // Dynamically calc approval percentage against mapped targets
                        let validVotes = expense.approvals.filter(a => a.status === 'Approved').length;
                        
                        // We subtract the manager vote from the count if they were required separately before the percentage evaluation group
                        if (offsetStep > 0 && expense.approvals.length > 0) {
                            validVotes -= 1; // Remove the manager's forced initial key vote from the arbitrary percentage pool
                        }
                        // Total group size is mapped strictly by the Array config size built by Admin
                        const totalVotersReq = rule.sequence.length > 0 ? rule.sequence.length : 1; 

                        const currentPercentage = (validVotes / totalVotersReq) * 100;
                        
                        if (currentPercentage >= rule.percentageRule) {
                            expense.status = 'Approved';
                        }
                        // If percentage unmet, it just remains pending while other users vote.
                    } 
                    // PDF Baseline: Strict Sequential Engine Step++
                    else if (rule && (rule.conditionFlow === 'None' || !rule.conditionFlow)) {
                        expense.currentApprovalStep += 1; // Advance to next target node Array
                        const limitMaxSteps = rule.sequence.length + offsetStep;
                        if (expense.currentApprovalStep >= limitMaxSteps) {
                            expense.status = 'Approved';
                        }
                    }
                }
            }
        }

        await expense.save();
        res.json(expense);
    } catch (error) {
        next(error);
    }
};

exports.ocrExtract = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No receipt layout uploaded" });
        const extractedData = await ocrService.extractReceiptData(req.file.path);
        res.json(extractedData);
    } catch (error) {
        next(error);
    }
};
