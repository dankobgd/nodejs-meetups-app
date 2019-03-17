const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Meetup = require('../models/meetup');
const {asyncWrap} = require('../middleware/middleware');

let shouldShowToast = true;

//  Get profile page
module.exports.profile_get = asyncWrap(async (req, res, next) => {
  const profileOwner = () => req.user && req.user._id.toString() === req.params.id.toString();
  const user = await User.findById(req.params.id);
  const promises = user.registeredMeetups.map(mid => Meetup.findById(mid));
  const regMeetups = await Promise.all(promises);
  const userCreatedMeetups = await Meetup.find({creatorId: user._id});

  const profileDefault = {
    title: 'Profile',
    user,
    registeredMeetups: regMeetups,
    userCreatedMeetups,
    profileOwner: profileOwner(),
    shouldShowToast,
  };

  const profileExtended = {
    ...profileDefault,
    avatar: user.avatar,
  };

  if (user.avatar) {
    res.format({
      html: () => res.render('user/profile', profileExtended),
      json: () => res.json(profileExtended),
    });
  } else {
    res.format({
      html: () => res.render('user/profile', profileDefault),
      json: () => res.json(profileDefault),
    });
  }
});

//  Update profile info
module.exports.update_profile_info = asyncWrap(async (req, res, next) => {
  const opts = {
    headers: {
      Cookie: req.headers.cookie,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  const response = await fetch(req.headers.referer, opts);
  const data = await response.json();

  const profileObj = {
    user: data.user,
    registeredMeetups: data.registeredMeetups,
    userCreatedMeetups: data.userCreatedMeetups,
    profileOwner: data.profileOwner,
    avatar: data.avatar,
  };

  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('email', 'E-mail field is required').notEmpty();
  req.checkBody('email', 'Please enter a valid email address').isEmail();

  const formInfoErrors = req.validationErrors();
  if (formInfoErrors) {
    shouldShowToast = false;
    return res.render('user/profile', {...profileObj, formInfoErrors});
  }

  if (req.files.length <= 0) {
    const user = await User.findById(req.params.id);
    user.username = req.body.username;
    user.email = req.body.email;

    user.save(err => {
      if (err) console.log(err);
      shouldShowToast = true;
      res.redirect(`/profile/${req.params.id}`);
    });
  } else {
    const {filename: imgName, path: imgPath} = req.files[0];
    const user = await User.findById(req.params.id);
    user.username = req.body.username;
    user.email = req.body.email;
    user.avatar = imgPath;

    user.save(err => {
      if (err) console.log(err);
      shouldShowToast = true;
      res.redirect(`/profile/${req.params.id}`);
    });
  }
});

//  Update profile password
module.exports.update_profile_password = asyncWrap(async (req, res, next) => {
  const opts = {
    headers: {
      Cookie: req.headers.cookie,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  const response = await fetch(req.headers.referer, opts);
  const data = await response.json();

  const profileObj = {
    user: data.user,
    registeredMeetups: data.registeredMeetups,
    userCreatedMeetups: data.userCreatedMeetups,
    profileOwner: data.profileOwner,
    avatar: data.avatar,
  };

  req.checkBody('oldPassword', 'Old password is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('confirmPassword', 'Confirm password is required').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const formPwErrors = req.validationErrors();
  if (formPwErrors) {
    shouldShowToast = false;
    return res.render('user/profile', {...profileObj, formPwErrors});
  }

  shouldShowToast = true;
  const user = await User.findById(req.params.id);

  if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
    const oldPasswordError = 'Old password is incorrect';
    shouldShowToast = false;
    res.format({
      html: () => res.render('user/profile', {...profileObj, formPwErrors, oldPasswordError}),
      json: () => res.json({...profileObj, formPwErrors, oldPasswordError}),
    });
  } else {
    user.password = req.body.password;
    user.save(err => {
      if (err) console.log(err);
      shouldShowToast = true;
      res.redirect(`/profile/${req.params.id}`);
    });
  }
});
