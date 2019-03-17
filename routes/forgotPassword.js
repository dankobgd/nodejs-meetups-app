const express = require('express');

const router = express.Router();
const ForgotPasswordController = require('../controllers/forgotPassword');

router
  .route('/')
  .get(ForgotPasswordController.forgotPassword_get)
  .post(ForgotPasswordController.forgotPassword_post);

module.exports = router;
