const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const CodeSnippet = require('../models/CodeSnippet');

router.post('/save', async (req, res) => {
    try {
        const { code, numVisitors, storageDuration } = req.body;

        const newSnippet = new CodeSnippet({
            code,
            numVisitors,
            storageDuration
        });

        await newSnippet.save();

        res.status(201).json({ message: 'Code snippet saved successfully', randomId: newSnippet.randomId });
    } catch (err) {
        console.error('Error saving code snippet:', err);
        res.status(500).json({ error: 'An error occurred while saving the code snippet' });
    }
});
router.get('/retrieve/:randomId', async (req, res) => {
    try {
        const snippet = await CodeSnippet.findOne({ randomId: req.params.randomId });

        if (!snippet) {
            return res.status(404).json({ error: 'Code snippet not found' });
        }

        res.json(snippet);
    } catch (err) {
        console.error('Error retrieving code snippet:', err);
        res.status(500).json({ error: 'An error occurred while retrieving the code snippet' });
    }
});

module.exports = router;
