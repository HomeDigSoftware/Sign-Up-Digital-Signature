const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Handles user registration.
 * @async
 * @function
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @property {string} req.body.email - The user's email address.
 * @property {string} req.body.password - The user's password.
 * @returns {Promise<void>}
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        const token = user.getSignedToken();
        res.status(201).json({ success: true, token });
    } catch (error) {
        next(error);
    }
};

/**
 * Handles user login.
 * @async
 * @function
 * @param {Object} req - The Express.js request object.
 * @param {Object} res - The Express.js response object.
 * @property {string} req.body.email - The user's email address.
 * @property {string} req.body.password - The user's password.
 * @returns {Promise<void>}
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'אימייל או סיסמה שגויים'
            });
        }

        const token = user.getSignedToken();
        res.json({ success: true, token });
    } catch (error) {
        next(error);
    }
};

// קבלת פרטי משתמש
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };
