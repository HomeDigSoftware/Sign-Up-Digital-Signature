const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { updateUser, changePassword } = require('../controllers/userController');

// קבלת פרטי המשתמש המחובר
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
});

// עדכון פרטי משתמש
router.put('/me', protect, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
});

router.put('/update', protect, updateUser);
router.put('/change-password', protect, changePassword);

module.exports = router; 