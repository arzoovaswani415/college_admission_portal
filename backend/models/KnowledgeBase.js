const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['admission', 'programs', 'scholarships', 'general', 'requirements', 'deadlines', 'tuition', 'campus', 'university', 'contact']
    },
    tags: [{
        type: String,
        lowercase: true
    }],
    embedding: [{
        type: Number
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient searching
knowledgeBaseSchema.index({ category: 1, isActive: 1 });
knowledgeBaseSchema.index({ tags: 1 });
knowledgeBaseSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
