const MeetingHistory = require('../../model/schema/meeting')
const mongoose = require('mongoose');

const add = async (req, res) => {
    try {
        // Validate required fields
        const { title, startDate, endDate } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        if (!startDate) {
            return res.status(400).json({ error: 'Start date is required' });
        }
        if (!endDate) {
            return res.status(400).json({ error: 'End date is required' });
        }

        const meeting = new MeetingHistory({
            ...req.body,
            createBy: req.user.userId
        });

        const result = await meeting.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Validation Error', 
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const index = async (req, res) => {
    try {
        const query = { ...req.query, deleted: false };
        const meetings = await MeetingHistory.find(query)
            .populate({
                path: 'createBy',
                match: { deleted: false },
                select: 'firstName lastName email'
            })
            .populate({
                path: 'participants',
                match: { deleted: false },
                select: 'firstName lastName email'
            })
            .exec();

        const result = meetings.filter(meeting => 
            meeting.createBy !== null && 
            (!meeting.participants.length || meeting.participants.some(participant => participant !== null))
        );
        
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const view = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findById(req.params.id)
            .populate({
                path: 'createBy',
                match: { deleted: false },
                select: 'firstName lastName email'
            })
            .populate({
                path: 'participants',
                match: { deleted: false },
                select: 'firstName lastName email'
            });

        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.status(200).json(meeting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteData = async (req, res) => {
    try {
        const meeting = await MeetingHistory.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );

        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const deleteMany = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids)) {
            return res.status(400).json({ error: 'Invalid request body. Expected array of ids.' });
        }

        const result = await MeetingHistory.updateMany(
            { _id: { $in: ids } },
            { deleted: true }
        );

        res.status(200).json({ 
            message: 'Meetings deleted successfully',
            deletedCount: result.modifiedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { add, index, view, deleteData, deleteMany }