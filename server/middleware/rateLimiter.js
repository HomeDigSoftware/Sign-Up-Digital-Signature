const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 דקות
    max: 100, // מקסימום 100 בקשות לכל IP
    message: {
        status: 'error',
        message: 'יותר מדי בקשות מכתובת IP זו, אנא נסה שוב מאוחר יותר'
    }
});

module.exports = rateLimiter; 