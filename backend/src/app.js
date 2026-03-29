const express = require('express');
const cors = require('cors');

// Import App Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Middleware Setups
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API is running...' });
});

// Mounted Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/expenses', expenseRoutes);

// General Error Handling Middleware Payload Wrapper
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
