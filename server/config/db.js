const mongoose = require('mongoose');




/**
 * Establishes a connection to the MongoDB database specified in the MONGO_URI environment variable.
 * @async
 * @function
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI חסר בקובץ התצורה');
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB מחובר: ${conn.connection.host}`);
    } catch (error) {
        console.error('שגיאת התחברות למסד הנתונים:');
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
