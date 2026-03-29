const User = require('../models/User');
const Company = require('../models/Company');
const jwt = require('jsonwebtoken');
const countryService = require('../services/countryService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// Expose countries/currencies dynamically for frontend signup selection
exports.getCountries = async (req, res, next) => {
    try {
        const data = await countryService.getCountriesAndCurrencies();
        res.json(data);
    } catch (error) {
        next(error);
    }
};

exports.registerCompanyAdmin = async (req, res, next) => {
    try {
        const { companyName, country, currency, adminName, adminEmail, adminPassword } = req.body;
        
        const userExists = await User.findOne({ email: adminEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const company = await Company.create({
            name: companyName,
            country,
            currency   // Base currency mapped from frontend selection using Countries API
        });

        const adminUser = await User.create({
            name: adminName,
            email: adminEmail,
            passsword: adminPassword, // Ensure bcrypt hashing is configured down the line
            role: 'Admin',
            company: company._id
        });

        company.admin = adminUser._id;
        await company.save();

        res.status(201).json({
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
            company: company,
            token: generateToken(adminUser._id)
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('company');

        if (user && user.password === password) { 
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};
