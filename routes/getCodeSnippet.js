const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');

router.get('/:randomId', async (req, res) => {
    try {
        const snippet = await CodeSnippet.findOne({ randomId: req.params.randomId });

        if (!snippet) {
            return res.status(404).send('Code snippet not found');
        }

        const formattedSnippet = {
            id: snippet._id,
            code: snippet.code,
            numVisitors: snippet.numVisitors,
            storageDuration: snippet.storageDuration,
            randomId: snippet.randomId,
            createdAt: snippet.createdAt.toISOString() // Convert to ISO string
        };

        res.render('copySnippet', { snippet: formattedSnippet });
    } catch (err) {
        console.error('Error retrieving code snippet:', err);
        res.status(500).send('An error occurred while retrieving the code snippet');
    }
});

module.exports = router;
