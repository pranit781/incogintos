const mongoose = require('mongoose');

const codeSnippetSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    numVisitors: {
        type: Number,
        required: true
    },
    storageDuration: {
        type: Number,
        required: true
    },
    randomId: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            // Generate 8-digit random number
            return Math.floor(1000 + Math.random() * 9000).toString();

        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

module.exports = CodeSnippet;
