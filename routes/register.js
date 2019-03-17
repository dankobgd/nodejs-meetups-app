const express = require('express');
const middleware = require('../middleware/middleware');

const router = express.Router();
const RegisterController = require('../controllers/register');

router
  .route('/')
  .get(middleware.restrictLogin, RegisterController.register_get)
  .post(RegisterController.register_post);

module.exports = router;
