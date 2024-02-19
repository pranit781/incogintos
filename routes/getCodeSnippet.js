const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');

router.get('/:randomId', async (req, res) => {
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
