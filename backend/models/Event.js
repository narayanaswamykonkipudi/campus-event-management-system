const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    department: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rules: { type: String },
    eligibleTags: {
        year: [Number],
        department: [String],
        section: [String]
    },
    maxRegistrations: { type: Number, required: true },
    currentRegistrations: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    eventDate: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
