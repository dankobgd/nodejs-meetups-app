const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {asyncWrap} = require('../middleware/middleware');

//  Get register page
module.exports.register_get = (req, res, next) => {
  res.render('user/register', {title: 'Register'});
};

//  Post register page
module.exports.register_post = asyncWrap(async (req, res, next) => {
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('email', 'E-mail field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').isEmail();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    return res.render('user/register', {validationErrors});
  }

  const user = await User.findOne({email: req.body.email});
  if (user) {
    const error = 'The email is already taken, please try another one';
    return res.render('user/register', {error});
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });

  newUser.save(err => {
    if (err) {
      const error = 'Authentication error, please try again';
      res.render('user/register', {error});
    }

    req.session.success = 'Account created, you can now log in';
    res.redirect('/login');
  });
});
