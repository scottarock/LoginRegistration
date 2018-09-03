const router = require('express').Router();

module.exports = router
  .use('/user', require('./user.routes'));
