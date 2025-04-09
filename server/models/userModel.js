const mongoose = require('mongoose');
// This code defines a Mongoose schema for a user model with email and password fields.
//  The email field is unique and required, while the password field is also required. The timestamps option adds createdAt and updatedAt fields to the schema automatically.
// The model is then exported for use in other parts of the application. 
// This schema can be used to create, read, update, and delete user documents
//  in a MongoDB database using Mongoose.
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
