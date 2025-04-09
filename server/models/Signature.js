const mongoose = require('mongoose');

const SignatureSchema = new mongoose.Schema({
    signatureData: {
        type: String,
        required: [true, 'נדרשים נתוני חתימה']
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        required: [true, 'נדרש מזהה מסמך']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'נדרש מזהה משתמש']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'rejected'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Signature', SignatureSchema); 