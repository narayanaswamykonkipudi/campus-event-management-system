const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Faculty who created the event
    registeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['registered', 'attended', 'completed'], default: 'registered' },
    score: { type: Number },
    certificateType: { type: String, enum: ['participation', 'merit', 'none'], default: null }
}, { timestamps: true });

// Prevent duplicate registration: studentId + eventId must be unique
registrationSchema.index({ studentId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
