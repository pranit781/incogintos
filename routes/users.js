
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');  
 
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

        const { name, email, occupationEducation, password } = req.body;

        if (!name || !email || !occupationEducation || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email is already registered' });
        }


        const newUser = new User({
            name,
            email,
            occupationEducation,
            password
        });


        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
        
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ success: false, error: 'An error occurred while registering the user' });
    }
});


router.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.status(200).json({ success: true, message: 'Login successful', user });
    } catch (error) {

        console.error('Error logging in:', error);
        res.status(500).json({ success: false, error: 'An error occurred while logging in' });
    }
});

module.exports = router;
