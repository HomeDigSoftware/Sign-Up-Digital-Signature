const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
    createSignature, 
    getSignature,
    updateSignature 
} = require('../controllers/signatureController');

router.post('/', protect, createSignature);
router.get('/:id', protect, getSignature);
router.put('/:id', protect, updateSignature);

module.exports = router; 