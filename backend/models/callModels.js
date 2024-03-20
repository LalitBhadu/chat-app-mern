// Call model schema definition
const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    senderId: {
        type: String,
        required: true
    },
    recipientId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'ended'],
        default: 'pending'
    }
});

const Call = mongoose.model('Call', callSchema);

module.exports = Call;
