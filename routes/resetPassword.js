const express = require('express');

const router = express.Router();
const ResetPasswordController = require('../controllers/resetPassword');

router
  .route('/:token')
  .get(ResetPasswordController.resetPassword_get)
  .post(ResetPasswordController.resetPassword_post);

module.exports = router;
