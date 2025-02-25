const mongoose = require('mongoose');

const meetingHistory = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    location: { 
        type: String 
    },
    meetingLink: { 
        type: String 
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: { 
        type: String, 
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model('Meetings', meetingHistory, 'Meetings');
