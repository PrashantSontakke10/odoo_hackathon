const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Manager', 'Employee'], default: 'Admin' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // To define manager relationships
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
