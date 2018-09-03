const mongoose = require('mongoose'),
      path = require('path'),
      fs = require('fs'),
      modelsPath = path.resolve('server', 'models'),
      jsFileReg = new RegExp('\\.js$', 'i');

mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost:27017/users',
  { useNewUrlParser: true },
);
mongoose.connection.on('connect', () => console.log('Mongo DB connected'));

fs.readdirSync(modelsPath).forEach(file => {
  if ( jsFileReg.test(file) ) {
    require(path.join(modelsPath, file));
  }
});
