const express = require('express');
const middleware = require('../middleware/middleware');

const router = express.Router();
const LoginController = require('../controllers/login');

router
  .route('/')
  .get(middleware.restrictLogin, LoginController.login_get)
  .post(LoginController.login_post);

module.exports = router;
