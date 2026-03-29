const User = require('../models/User');
const ApprovalRule = require('../models/ApprovalRule');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ company: req.user.company })
            .select('-password')
            .populate('manager', 'name email');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

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

        // Resolve dependencies instantly for frontend payload
        const populatedUser = await User.findById(user._id).select('-password').populate('manager', 'name email');

        res.status(201).json(populatedUser);
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
        
        // Define manager relationships for employees. 'null' maps to unassign.
        user.manager = req.body.managerId || null;
        await user.save();
        
        const populatedUser = await User.findById(user._id).select('-password').populate('manager', 'name email');
        res.json(populatedUser);
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
