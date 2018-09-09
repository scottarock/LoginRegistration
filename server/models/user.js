const mongoose = require('mongoose'),
      { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],
    validate: [{
      validator: function(value) {
        return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
      },
      message: 'Email is not a valid format',
    }],
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Password is required'],
    validate: [{
      validator: function(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test(value)
      },
      message: 'Password needs to be between 8 and 32 characters long and contain at least 1 uppercase, 1 number and 1 special character',
    }],
  },
  passwordConfirm: {
    type: String,
    trim: true,
    required: [true, 'Password confirmation is required'],
    validate: [{
      validator: function(value) {
        return value === this.password;
      },
      message: 'Password confirmation did not match password',
    }],
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last name is required'],
  },
  birthday: {
    type: Date,
    required: [true, 'Birthday is required'],
  },
});

module.exports = mongoose.model('User', userSchema);
