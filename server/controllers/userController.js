const User = require('../models/User');

// עדכון פרטי משתמש
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }

        // שדות מותרים לעדכון
        const { name, email } = req.body;
        
        // עדכון השדות אם הם קיימים בבקשה
        if (name) user.name = name;
        if (email) user.email = email;
        
        await user.save();
        
        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בעדכון המשתמש' });
    }
};

// שינוי סיסמה
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'משתמש לא נמצא' });
        }
        
        // בדיקה שהסיסמה הנוכחית נכונה
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'סיסמה נוכחית שגויה' });
        }
        
        // עדכון הסיסמה
        user.password = newPassword;
        await user.save();
        
        res.json({ success: true, message: 'הסיסמה שונתה בהצלחה' });
    } catch (error) {
        res.status(500).json({ message: 'שגיאה בשינוי הסיסמה' });
    }
};

module.exports = { updateUser, changePassword }; 