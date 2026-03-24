const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/authMiddleware');

// Create Event (Faculty only)
router.post('/', verifyToken, async (req, res) => {
    if (req.user.role !== 'faculty') return res.status(403).json({ message: 'Access denied. Faculty only.' });

    try {
        const { title, description, department, rules, eligibleTags, maxRegistrations, deadline, eventDate } = req.body;

        // Ensure faculty can only create events for their own department
        if (department !== req.user.department) {
            return res.status(403).json({ message: 'You can only create events for your own department.' });
        }

        const newEvent = new Event({
            title, description, department, rules, eligibleTags, maxRegistrations, deadline, eventDate,
            createdBy: req.user.id
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all events (filtered by visibility for students)
router.get('/', verifyToken, async (req, res) => {
    try {
        let events;
        if (req.user.role === 'admin') {
            events = await Event.find().populate('createdBy', 'name');
        } else if (req.user.role === 'faculty') {
            // Faculty sees all events, but maybe their own first? For MVP, all is fine.
            events = await Event.find().populate('createdBy', 'name');
        } else if (req.user.role === 'student') {
            // Student eligibility logic: Match tags (Simplified for now, will refine if needed)
            // Ideally, we fetch the student's info and match.
            // But let's just return all for visibility, student-side will filter or show 'eligible' badge.
            // OR filter here: (Actually requirement says view only eligible)
            const User = require('../models/User');
            const student = await User.findById(req.user.id);

            events = await Event.find({
                isActive: true,
                "eligibleTags.year": student.year,
                "eligibleTags.department": student.department
            }).populate('createdBy', 'name');
        }
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Event (Creator Faculty only)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        console.log(`Updating event ${req.params.id} by user ${req.user.id}`);
        // Only the creator can edit
        if (event.createdBy.toString() !== req.user.id) {
            console.log(`Auth failed: creator ${event.createdBy} !== user ${req.user.id}`);
            return res.status(403).json({ message: 'Not authorized to edit this event' });
        }

        const { title, description, rules, eligibleTags, maxRegistrations, deadline, eventDate } = req.body;

        if (title) event.title = title;
        if (description) event.description = description;
        if (rules !== undefined) event.rules = rules;
        if (eligibleTags) event.eligibleTags = eligibleTags;
        if (maxRegistrations) event.maxRegistrations = maxRegistrations;
        if (deadline) event.deadline = deadline;
        if (eventDate !== undefined) event.eventDate = eventDate || null;

        await event.save();
        res.json(event);
    } catch (err) {
        console.error('Error in PUT /events/:id:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete Event (Admin or Creator)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await event.deleteOne();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
