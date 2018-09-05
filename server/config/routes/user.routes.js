const users = require('../../controllers/users'),
      router = require('express').Router();

router.get('/register', users.new);
router.post('/register', users.create);
router.get('/login', users.login);
router.post('/login', users.authenticate);
router.get('/dashboard', users.show);

module.exports = router;
