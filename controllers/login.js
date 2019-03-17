const User = require('../models/user');
const {asyncWrap} = require('../middleware/middleware');

//  Get login page
module.exports.login_get = (req, res, next) => {
  res.render('user/login', {title: 'Login'});
};

//  Post login page
module.exports.login_post = asyncWrap(async (req, res, next) => {
  req.checkBody('email', 'E-mail field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').isEmail();

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    return res.render('user/login', {validationErrors});
  }

  const user = await User.findOne({email: req.body.email});
  if (!user) {
    const error = "User with this email doesn't exist";
    return res.render('user/login', {error});
  }

  if (!user.validPassword(req.body.password)) {
    const error = 'Password is incorrect';
    return res.render('user/login', {error});
  }

  req.session.userId = user._id;
  req.session.success = `welcome ${user.username}`;
  res.redirect(req.session.redirectURL || '/');
  delete req.session.redirectURL;
});
