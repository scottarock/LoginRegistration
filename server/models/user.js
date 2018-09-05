const mongoose = require('mongoose'),
      { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  birthday: {
    type: Date,
  },
});

module.exports = mongoose.model('User', userSchema);
