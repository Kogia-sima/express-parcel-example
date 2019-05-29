const path = require('path');
const express = require('express');
const Bundler = require('parcel-bundler');

function main() {
  const parcel_option = {
    entryFiles: [ './app/index.html' ],
    publicUrl: '/api/',
  };
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  const bundler = new Bundler(parcel_option.entryFiles, parcel_option);

  const app = express();
  app.use(function(req, res, next) {
    if (req.originalUrl.startsWith('/api/')) {
      next();
    } else {
      res.status(200).send(
        'You are not requesting to target /api/.<br>' +
        'Current path: ' + req.originalUrl);
    }
  });

  const parcel_middleware = bundler.middleware();

  app.use('/api', function(req, res, next) {
    req.url = req.originalUrl;
    parcel_middleware(req, res, next);
  });

  app.listen(3000, function() {
    console.log('Server listening on port 3000.');
  });
}

if (require.main === module) {
  main();
}
