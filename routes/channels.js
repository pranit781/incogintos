// channels.js
const express = require('express');
const router = express.Router();

const Channel = require('../models/Channel');
 
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
        const { name, description, adminEmail } = req.body;  
        const connectionCode = generateConnectionCode();  
        const channel = new Channel({ name, description, connectionCode, adminEmail });  
        await channel.save();
        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/createdBy/:adminEmail', async (req, res) => {
    try {
        const { adminEmail } = req.params;
        const channels = await Channel.find({ adminEmail });  
        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/join', (req, res) => { 


});


function generateConnectionCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = length || 8; 
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}


module.exports = router;
