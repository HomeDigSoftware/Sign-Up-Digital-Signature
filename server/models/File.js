const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: [true, 'נדרש שם קובץ']
    },
    path: {
        type: String,
        required: [true, 'נדרש נתיב קובץ']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    signaturePosition: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
    },
    status: {
        type: String,
        enum: ['pending', 'signed', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', FileSchema); 