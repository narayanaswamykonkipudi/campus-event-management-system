const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/authMiddleware');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, age, gender, mobile, email, password, role, year, department, section, collegeId } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, age, gender, mobile, email, password, role, year, department, section, collegeId });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name, department: user.department }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role, department: user.department }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get stats (Admin only)
router.get('/stats', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const facultyCount = await User.countDocuments({ role: 'faculty' });
        const adminCount = await User.countDocuments({ role: 'admin' });
        res.json({ studentCount, facultyCount, adminCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
