
const mongoose = require('mongoose');
const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    connectionCode: {
        type: String,
        required: true,
        unique: true
    },
    adminEmail: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});


const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;
