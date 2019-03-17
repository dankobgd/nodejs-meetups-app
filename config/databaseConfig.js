const mongoose = require('mongoose');
const config = require('.');

mongoose.Promise = global.Promise;

try {
  mongoose.connect(
    config.db.url,
    config.db.options
  );
} catch (err) {
  mongoose.createConnection(config.db.url, config.db.options);
}

mongoose.connection
  .once('open', () => console.log('MongoDB Running'))
  .on('error', e => {
    throw e;
  });
