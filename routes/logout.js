const express = require('express');

const router = express.Router();
const LogoutController = require('../controllers/logout');

router.get('/', LogoutController.logout);

module.exports = router;
