const crypto = require('crypto');
const mailer = require('../config/mailer');
const User = require('../models/user');
const {asyncWrap} = require('../middleware/middleware');
const config = require('../config');

//  Forgot password page get
module.exports.forgotPassword_get = (req, res, next) => {
  res.render('user/forgotPassword', {title: 'Forgot Password'});
};

//  Forgot password page post
module.exports.forgotPassword_post = asyncWrap(async (req, res, next) => {
  req.checkBody('email', 'E-mail is required').notEmpty();
  req.checkBody('email', 'Invalid E-mail').isEmail();

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    return res.render('user/forgotPassword', {validationErrors});
  }

  function generateToken() {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(20, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          resolve(buffer.toString('hex'));
        }
      });
    });
  }

  function fetchUser(token) {
    return new Promise((resolve, reject) => {
      User.findOne({email: req.body.email}, (err, user) => {
        if (err) console.log(err);
        if (!user) {
          req.session.accountError = {message: 'No account with this e-mail can be found.'};
          return reject(new Error('no user found'));
        }

        /* eslint-disable no-param-reassign */
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now

        user.save(error => {
          if (error) return reject(error);
          resolve(user);
        });
      });
    });
  }

  function sendMail(user) {
    return new Promise((resolve, reject) => {
      // prettier-ignore
      const html = `<div>You are recieving this because you (or someone else) have requested the reset of password for your account.</div>
       <div>Please click on the following link, or paste this into your browser to complete the password reset process.</div>
       <a href="http://${req.headers.host}/resetPassword/${user.resetPasswordToken}">http://${req.headers.host}/resetPassword/${user.resetPasswordToken}</a>
       <div>If you did not request this, please ignore this email and your password will remain unchanged.</div>`;

      const options = {
        from: `Forgot Password ${config.email.from}`,
        to: user.email,
        subject: 'Password Reset',
        html,
      };

      mailer.sendMail(options, (error, info) => {
        if (error) {
          if (error) return reject(error);
        }

        req.session.emailSuccess = {message: `E-mail has been sent to: ${user.email} with more info`};
        resolve(info);
      });
    });
  }

  function handleError(err) {
    if (err.message === 'no user found') {
      return res.render('user/forgotPassword', {
        accountError: req.session.accountError,
      });
    }
  }

  async function initializeResetProcess() {
    const token = await generateToken();
    const user = await fetchUser(token);
    await sendMail(user);

    return res.render('user/forgotPassword', {
      emailSuccess: req.session.emailSuccess,
    });
  }
  initializeResetProcess().catch(err => handleError(err));
});
