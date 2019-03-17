const mailgun = require('mailgun-js');
const User = require('../models/user');
const {asyncWrap} = require('../middleware/middleware');
const config = require('../config');

mailgun({apiKey: config.email.apiKey, domain: config.email.domain});

//  Get reset password page
module.exports.resetPassword_get = asyncWrap(async (req, res) => {
  const user = await User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}});
  if (!user) {
    req.session.tokenError = {message: 'Password reset token is invalid or has expired.'};
  }

  res.render('user/resetPassword', {
    title: 'Reset Password',
    user,
    token: req.params.token,
    tokenError: req.session.tokenError,
  });
});

//  Post reset password page
module.exports.resetPassword_post = asyncWrap(async (req, res) => {
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('confirmPassword', 'Confirm password is required').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    return res.render('user/resetPassword', {validationErrors});
  }

  function fetchUser() {
    return new Promise((resolve, reject) => {
      User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, (err, user) => {
        if (err) console.log(err);
        if (!user) {
          req.session.tokenPostError = {message: 'Password reset token is invalid or has expired.'};
          return reject(new Error('no user found'));
        }

        /* eslint-disable no-param-reassign */
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save((error, usr) => {
          if (error) return reject(error);
          resolve(usr);
        });
      });
    });
  }

  function sendMail(user) {
    return new Promise((resolve, reject) => {
      const html = `<div>Hello, ${user.username}</div><div>Your password for the account: ${
        user.email
      } has been changed successfuly.</div>`;
      const data = {
        from: `Reset Password ${config.email.from}`,
        to: user.email,
        subject: 'Your password has been changed.',
        html,
      };

      mailgun.messages().send(data, (error, mailInfo) => {
        if (error) return reject(error);
        req.session.emailResetSuccess = {message: 'Your passoword has been changed!'};
        resolve(mailInfo);
      });
    });
  }

  function handleError(err) {
    if (err.message === 'no user found') {
      return res.render('user/resetPassword', {
        tokenPostError: req.session.tokenPostError,
      });
    }
  }

  function render() {
    res.render('user/resetPassword', {
      emailResetSuccess: req.session.emailResetSuccess,
    });
  }

  async function resetUserPassword() {
    const user = await fetchUser();
    const mailDetails = await sendMail(user);
    render();
  }
  resetUserPassword().catch(err => handleError(err));
});
