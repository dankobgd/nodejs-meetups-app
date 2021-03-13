const multer = require('multer');
const session = require('express-session');
const User = require('../models/user');
const config = require('../config');

//  Catch 404 and forward to error handler
module.exports.forward404 = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

//  Error handler
module.exports.errorHandler = (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
};

//  Global variables
module.exports.globalVariables = (req, res, next) => {
  res.locals.success = req.session.success;
  delete req.session.success;
  res.locals.isAuthenticated = Boolean(req.session.userId);
  res.locals.siteUrl = config.SITE_URL;
  next();
};

//  Create session
module.exports.createSession = session({
  secret: config.session.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {secure: false, maxAge: 3600000, expires: new Date(Date.now() + 3600000)},
});

//  Session check
module.exports.checkSession = (req, res, next) => {
  if (!(req.session && req.session.userId)) {
    return next();
  }

  User.findById(req.session.userId, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next();
    }

    /* eslint-disable no-param-reassign */
    user.password = undefined;
    req.user = user;
    res.locals.user = user;
    next();
  });
};

//  Require login
module.exports.requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    req.session.redirectURL = req.originalUrl;
    return res.redirect('/login');
  }
  next();
};

//  Restrict logged in
module.exports.restrictLogin = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
};

//  File upload multer
module.exports.upload = path => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `public/images/${path}`);
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  function fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
      req.fileFilterError = 'File extension not allowed. Allowed image formats: JPG, JPEG, PNG, BMP and GIF';
      return cb(null, false, req.fileFilterError);
    }
    cb(null, true);
  }

  return multer({storage, fileFilter});
};

module.exports.asyncWrap = fn => (req, res, next) => fn(req, res, next).catch(next);
