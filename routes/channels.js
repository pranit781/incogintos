// channels.js
const express = require('express');
const router = express.Router();

const Channel = require('../models/Channel');

// Define channel routes
router.get('/',async (req, res) => {
    try {
        const channels = await Channel.find();
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, description, adminEmail } = req.body; // Extract adminEmail from the request body
        const connectionCode = generateConnectionCode(); // Function to generate a unique connection code
        const channel = new Channel({ name, description, connectionCode, adminEmail }); // Include adminEmail in the channel data
        await channel.save();
        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/createdBy/:adminEmail', async (req, res) => {
    try {
        const { adminEmail } = req.params;
        const channels = await Channel.find({ adminEmail }); // Find channels with matching adminEmail
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/join', (req, res) => {
    // Handle POST request for /channels/join
});


function generateConnectionCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = length || 8; // Default length is 8 characters
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}


module.exports = router;
