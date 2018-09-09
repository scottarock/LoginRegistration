const express = require('express'),
      parser = require('body-parser'),
      session = require('express-session'),
      path = require('path'),
      port = process.env.PORT || 8000,
      app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve('client', 'views'));
app.use(express.static(path.resolve('client', 'static')));
app.use(parser.urlencoded({ extended: true }));
app.use(session({
  secret: 'lkauhjflksa',
  resave: false,
  saveUninitialized: true,
}));

require('./server/config/database');
app.use(require('./server/config/routes'));

app.listen(port, () => console.log(`app running on port ${port}`));
