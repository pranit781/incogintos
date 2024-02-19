// users.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import User model

// Define user routes
router.get('/', (req, res) => {
    res.send("User Root")
});
router.get('/adminObjectId/:adminEmail', async (req, res) => {
    try {
        const adminEmail = req.params.adminEmail;
        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ adminObjectId: admin._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/register', async (req, res) => {
    try {
        // Retrieve user data from the request body
        const { name, email, occupationEducation, password } = req.body;

        // Perform any necessary validation on the user data
        if (!name || !email || !occupationEducation || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            occupationEducation,
            password
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
        
    } catch (error) {
        // Send an error response
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, error: 'An error occurred while registering the user' });
    }
});


router.post('/login', async (req, res) => {
    try {
        // Retrieve user credentials from the request body
        const { email, password } = req.body;

        // Check if the user exists in the database
        const user = await User.findOne({ email });

        // If user not found or password doesn't match, return error
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // If credentials are valid, return success response
        res.status(200).json({ success: true, message: 'Login successful', user });
    } catch (error) {
        // Handle server error
        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'An error occurred while logging in' });
    }
});

module.exports = router;
