const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');

router.get('/:randomId', async (req, res) => {
    try {
        const snippet = await CodeSnippet.findOne({ randomId: req.params.randomId });

        if (!snippet) {
            return res.status(404).send('Code snippet not found');
        }

        // Increment the visitCount field by 1
        snippet.visitCount += 1;
        await snippet.save(); // Save the updated snippet

        // Check if numVisitors is greater than visitCount
        if (snippet.numVisitors < snippet.visitCount) {
            // Delete the document
            await CodeSnippet.deleteOne({ _id: snippet._id });
            return res.status(404).send('Code snippet deleted because numVisitors exceeded visitCount');
        }

        // Calculate storage duration in milliseconds
        const storageDurationMs = snippet.storageDuration * 3600000; // 1 hour = 3600000 milliseconds
        const currentTime = new Date();
        const creationTime = snippet.createdAt;
        const elapsedTime = currentTime - creationTime;

        // Check if the elapsed time exceeds the storage duration
        if (elapsedTime > storageDurationMs) {
            // Delete the document
            await CodeSnippet.deleteOne({ _id: snippet._id });
            return res.status(404).send('Code snippet deleted because storage duration exceeded');
        }

        const formattedSnippet = {
            id: snippet._id,
            code: snippet.code,
            numVisitors: snippet.numVisitors,
            storageDuration: snippet.storageDuration,
            randomId: snippet.randomId,
            createdAt: snippet.createdAt.toISOString(), // Convert to ISO string
            visitCount: snippet.visitCount // Include visitCount in the response
        };

        res.render('copySnippet', { snippet: formattedSnippet });
    } catch (err) {
        console.error('Error retrieving code snippet:', err);
        res.status(500).send('An error occurred while retrieving the code snippet');
    }
});

module.exports = router;
