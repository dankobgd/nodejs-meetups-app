const fs = require('fs');
const path = require('path');
const express = require('express');
const logger = require('morgan');
const expressValidator = require('express-validator');
const middleware = require('./middleware/middleware');
const configureViewEngine = require('./config/viewEngine');
require('./config/databaseConfig');

const app = express();

configureViewEngine(app);

app.use(middleware.createSession);
app.use(middleware.checkSession);
app.use(middleware.globalVariables);
app.use(logger('dev'));
app.use(expressValidator());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

const routesDir = path.join(__dirname, 'routes');
fs.readdirSync(routesDir).forEach(file => {
  const route = require(path.join(routesDir, file));
  const routePath = file === 'home.js' ? '/' : `/${file.slice(0, -3)}`;
  app.use(routePath, route);
});

app.use(middleware.forward404);
app.use(middleware.errorHandler);

module.exports = app;
