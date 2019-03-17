const express = require('express');

const router = express.Router();
const MeetupsController = require('../controllers/meetups');

router.get('/', MeetupsController.meetups_get);

module.exports = router;
