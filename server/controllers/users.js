const User = require('mongoose').model('User'),
      emailReg = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'),
      passwordReg = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}');

let data = {}

module.exports = {

  new: function(request, response) {
    // show registration page
    response.render('register', { data });
    data = {};
  },

  create: function(request, response) {
    // process the user submission from the registation page
    let messages = [];
    data = request.body;
    // validate the data
    if ( !data.firstName ) {
      // first name is required
      messages.push('First name is required');
    }
    if ( !data.lastName ) {
      // last name is required
      messages.push('Last name is required');
    }
    if ( !data.email ) {
      // email is required
      messages.push('Email is required');
    } else {
      if ( !emailReg.test(data.email) ) {
        // email should be valid format
        messages.push('Email is not a valid format');
      }
    }
    if ( !data.birthday ) {
      messages.push('Birthday is required');
    }
    if ( !data.password ) {
      messages.push('Password is required');
    } else {
      // validate that password meets requirements
      if ( !passwordReg.test(data.password) ) {
        messages.push('Password needs to be between 8 and 32 characters long and contain at least 1 uppercase, 1 number and 1 special character');
      }
    }
    if ( !data.passwordConfirm ) {
      messages.push('Password confirmation is required');
    } else {
      if ( data.password !== data.passwordConfirm ) {
        messages.push('Password and confirmation did not match');
      }
    }

    if ( messages.length > 0 ) {
      data.messages = messages;
      // if there is an error, redirect to login
      response.redirect('/user/register');
    } else {
      // data is correct and valid
      // 1 - test to see if email address already exists
      User.find({ email: data.email })
        .then(user =>{
          if ( user.length > 0 ) {
            // email already registered
            messages.push('That email is already registered, please use the login');
            data.messages = messages;
            response.redirect('/user/register');
          } else {
            // 2 - save to database
            delete data.passwordConfirm;
            return User.create(data)
              .then(user => {
                // 3 - start a session
                request.session.user = user;
                // 4 - go to user dashboard
                response.redirect('/user/dashboard');
                data = {};
            })
          }
        })
        .catch(error => {
          console.log(error);
          response.redirect('/user/register')
        });
    }
  },

  login: function(request, response) {
    // show the login page
    response.render('login', { data });
    data = {};
  },

  authenticate: function(request, response) {
    // process the user submission from the login page
    let messages = [];
    data = request.body;
    // validate the data
    if ( !data.email ) {
      // email is required
      messages.push('Email is required');
    }
    if ( !data.password ) {
      messages.push('Password is required');
    }

    if ( messages.length > 0 ) {
      data.messages = messages;
      // if there is an error, redirect to login
      response.redirect('/user/login');
    } else {
      // 1 - check against database
      User.find(data)
        .then(user => {
          if ( user.length === 0 ) {
            // no match
            messages.push('Email and password did not match');
            data.messages = messages;
            response.redirect('/user/login');
          } else {
            // 2 - start a session
            request.session.user = user[0];
            // 3 - go to user dashboard
            response.redirect('/user/dashboard');
            data = {};
          }
        })
        .catch(error => {
          console.log(error);
          response.redirect('/user/login');
        });
    }

  },

  show: function(request, response) {
    // show the dashboard page
    User.findById(request.session.user._id)
      .then(user => {
        response.render('dashboard', { user });
      })
      .catch(error => console.log(error));
  }

}
