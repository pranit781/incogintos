const express = require('express');
const router = express.Router();
const CodeSnippet = require('../models/CodeSnippet');

router.get('/:randomId', async (req, res) => {
    try {
        const snippet = await CodeSnippet.findOne({ randomId: req.params.randomId });

        if (!snippet) {
            return res.status(404).send('Code snippet not found');
        }
 
        snippet.visitCount += 1;
        await snippet.save(); 
        
        if (snippet.numVisitors < snippet.visitCount) {
            
            await CodeSnippet.deleteOne({ _id: snippet._id });
            return res.status(404).send('Code snippet deleted because numVisitors exceeded visitCount');
        } 
        const storageDurationMs = snippet.storageDuration * 3600000;  
        const currentTime = new Date();
        const creationTime = snippet.createdAt;
        const elapsedTime = currentTime - creationTime;
         if (elapsedTime > storageDurationMs) { 
            await CodeSnippet.deleteOne({ _id: snippet._id });
            return res.status(404).send('Code snippet deleted because storage duration exceeded');
        }

        const formattedSnippet = {
            id: snippet._id,
            code: snippet.code,
            numVisitors: snippet.numVisitors,
            storageDuration: snippet.storageDuration,
            randomId: snippet.randomId,
            createdAt: snippet.createdAt.toISOString(),  
            visitCount: snippet.visitCount  
                };

        res.render('copySnippet', { snippet: formattedSnippet });
    } catch (err) {
        console.error('Error retrieving code snippet:', err);
        res.status(500).send('An error occurred while retrieving the code snippet');
    }
});

module.exports = router;
