const User = require('mongoose').model('User');

module.exports = {

  new: function(request, response) {
    // show registration page
    response.render('register');
  },

  create: function(request, response) {
    // use the model to validate the user data
    let messages = [];
    let newUser = new User(request.body);
    newUser.validate(error => {
      // if there is an error, get the messages
      // and show them to user
      if ( error ) {
        messages = Object.keys(error.errors)
          .map(key => error.errors[key].message);
        return response.render('register', { data: request.body, messages });
      }
    });

    // data is correct and valid, try to save
    // 1 - test to see if email address already exists
    User.find({ email: newUser.email })
      .then(user => {
        if ( user.length > 0 ) {
          // email already registered
          messages.push('That email is already registered, please use the login');
          response.render('login', { data: request.body , messages });
        } else {
          // email available, okay to register
          // 2 - save to database
          // TODO: add bcrypt to password
          return User.create(newUser)
            .then(user => {
              // 3 - start a session
              request.session.user = user;
              // 4 - go to user dashboard
              response.redirect('/user/dashboard');
            })
        }
      })
      .catch(error => console.log(error));

  },

  login: function(request, response) {
    // show the login page
    response.render('login');
  },

  authenticate: function(request, response) {
    // process the user submission from the login page
    let data = request.body;
    let messages = [];
    // validate the data
    if ( !data.email ) {
      // email is required
      messages.push('Email is required');
    }
    if ( !data.password ) {
      messages.push('Password is required');
    }

    if ( messages.length > 0 ) {
      // if there is an error, show them to user
      response.render('login', { data, messages });
    } else {
      // 1 - check against database
      User.find(data)
        .then(user => {
          if ( user.length === 0 ) {
            // no match
            messages.push('Email and password did not match');
            response.render('login', { data, messages });
          } else {
            // 2 - start a session
            request.session.user = user[0];
            // 3 - go to user dashboard
            response.redirect('/user/dashboard');
          }
        })
        .catch(error => {
          console.log(error);
          response.render('login', { data, messages });
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
  },

  logout: function(request, response) {
    // end session, go back to home
    delete request.session.user;
    response.redirect('/');
  },

}
