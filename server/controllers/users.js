const User = require('mongoose').model('User');

module.exports = {

  new: function(request, response) {
    // show registration page
    response.render('register');
  },
  create: function(request, response) {
    // process the user submission from the registation page
  },
  login: function(request, response) {
    // show the login page
    response.render('login');
  },
  authenticate: function(request, response) {
    // process the user submission from the login page
  },

}
