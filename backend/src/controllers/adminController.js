const User = require('../models/User');
const ApprovalRule = require('../models/ApprovalRule');

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, role, managerId } = req.body;
        
        // Admin creates Employees & Managers
        const user = await User.create({
            name, 
            email, 
            password, 
            role, 
            company: req.user.company,
            manager: managerId || null
        });

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

exports.assignRole = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
        
        // Assign and change roles -> Employee, Manager
        user.role = req.body.role; 
        await user.save();
        
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.assignManager = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
        
        // Define manager relationships for employees
        user.manager = req.body.managerId;
        await user.save();
        
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.configureApprovalRules = async (req, res, next) => {
    try {
        const { isManagerApprover, sequence, conditionFlow, percentageRule, specificApprovers } = req.body;
        
        // Find or create rule for company
        let rule = await ApprovalRule.findOne({ company: req.user.company });
        if(!rule) {
            rule = new ApprovalRule({ company: req.user.company });
        }

        // Apply rules configurations (Sequential, Conditional, Hybrid)
        if(isManagerApprover !== undefined) rule.isManagerApprover = isManagerApprover;
        if(sequence) rule.sequence = sequence;
        if(conditionFlow) rule.conditionFlow = conditionFlow;
        if(percentageRule) rule.percentageRule = percentageRule;
        if(specificApprovers) rule.specificApprovers = specificApprovers;

        await rule.save();
        res.json(rule);
    } catch (error) {
        next(error);
    }
};
