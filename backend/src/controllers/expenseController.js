const Expense = require('../models/Expense');
const ApprovalRule = require('../models/ApprovalRule');
const User = require('../models/User');
const Company = require('../models/Company');
const ocrService = require('../services/ocrService');
const currencyService = require('../services/currencyService');

exports.submitExpense = async (req, res, next) => {
    try {
        const { amountOriginal, currencyOriginal, category, description, date, receiptUrl } = req.body;
        
        // Fetch Tenant context
        const companyId = req.user.company;
        const companyDoc = await Company.findById(companyId);
        if (!companyDoc) return res.status(404).json({ message: "Company not found" });

        // Calculate mapped company currency live
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
            currentApprovalStep: 1, // Workflow initialization
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
            query.employee = req.user._id; // Isolate explicitly to own submits
        } else if (req.user.role === 'Manager') {
            // Managers view their sub-employees configured by the admin 'manager' assign relationship
            const teamMembers = await User.find({ manager: req.user._id }).select('_id');
            const teamIds = teamMembers.map(member => member._id);
            
            // Managers can view their own AND expenses filed by users inside their immediate tree
            query.$or = [
                { employee: req.user._id },
                { employee: { $in: teamIds } }
            ];
        } 
        // Admin skips limitations - hits pure company pool logic

        const expenses = await Expense.find(query).populate('employee', 'name email role manager');
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
        
        // Push History log
        expense.approvals.push({
            approver: req.user._id,
            status,
            comments,
            date: new Date()
        });

        // Resolve active configured rules engine
        const rule = await ApprovalRule.findOne({ company: req.user.company });

        // Condition A: Admins wield override control
        if (req.user.role === 'Admin') {
            expense.status = status; 
        } 
        // Condition B: Hard reject cuts rule parsing short
        else if (status === 'Rejected') {
            expense.status = 'Rejected';
        } 
        // Condition C: Conditional Flows Evaluation
        else {
            let isAutoApproved = false;

            // Scenario 1: Specific Approver (e.g., CFO overrides logic)
            if (rule && (rule.conditionFlow === 'Specific' || rule.conditionFlow === 'Hybrid')) {
                if (rule.specificApprovers && rule.specificApprovers.includes(req.user._id)) {
                    isAutoApproved = true; 
                }
            }

            if (isAutoApproved) {
                expense.status = 'Approved';
            } else {
                // Scenario 2: Percentage Approvals Evaluation
                if (rule && (rule.conditionFlow === 'Percentage' || rule.conditionFlow === 'Hybrid') && rule.percentageRule > 0) {
                    const approvedCount = expense.approvals.filter(a => a.status === 'Approved').length;
                    const totalRequiredApprovers = rule.sequence && rule.sequence.length > 0 ? rule.sequence.length : 1; 
                    const currentPercentage = (approvedCount / totalRequiredApprovers) * 100;
                    
                    if (currentPercentage >= rule.percentageRule) {
                        expense.status = 'Approved';
                    } else {
                        expense.currentApprovalStep += 1;
                    }
                } 
                // Scenario 3: Standard Sequential Mapping 
                else if (rule && rule.sequence && rule.sequence.length > 0) {
                    if (expense.currentApprovalStep >= rule.sequence.length) {
                        expense.status = 'Approved'; // Met last step configuration threshold
                    } else {
                        expense.currentApprovalStep += 1; // Bump sequential counter
                    }
                } else {
                    // Scenario 4: Base fallback (no rules specified, Manager validated it)
                    expense.status = 'Approved';
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
