require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// התחברות למסד הנתונים
connectDB();

const app = express();

// middleware בסיסי
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(rateLimiter);

// הגדרת תיקיית uploads כסטטית
app.use('/uploads', express.static('uploads'));

// נתיבים
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/signatures', require('./routes/signatureRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// טיפול בשגיאות
app.use(errorHandler);

// טיפול בנתיבים לא קיימים
app.use((req, res) => {
    res.status(404).json({ message: 'הנתיב המבוקש לא נמצא' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`השרת פועל בפורט ${PORT}`));

// טיפול בשגיאות לא מטופלות
process.on('unhandledRejection', (err) => {
    console.error('שגיאה לא מטופלת:', err);
    process.exit(1);
});

// This code sets up a basic Express.js server that connects to a MongoDB
//  database using Mongoose. It uses the dotenv package to load environment variables from a
// .env file, and the cors package to enable Cross-Origin Resource Sharing.
//  The server listens on a specified port (defaulting to 5000) and uses JSON middleware to parse incoming requests.
//  The authentication routes are defined in a separate module and are mounted at the '/api/auth' endpoint.
// The server is started and logs a message indicating that it is running on the specified port.
// The connectDB function is responsible for establishing the connection to the MongoDB database using
//  the connection string stored in the MONGO_URI environment variable. If the connection is successful,
//  a message is logged to the console; if it fails, an error message is logged and the process exits with a non-zero status code.
// The server is set up to handle JSON requests and CORS, making it suitable for building RESTful APIs or web applications that require user authentication and data storage in a MongoDB database.
// The authentication routes are defined in a separate module and are mounted at the '/api/auth' endpoint. This modular approach allows for better organization and maintainability of the codebase, especially as the application grows in complexity.
// The server is started and logs a message indicating that it is running on the specified port. 
// This provides a clear entry point for the application and allows developers to easily 
// test and debug the authentication functionality.