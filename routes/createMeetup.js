const express = require('express');

const router = express.Router();
const middleware = require('../middleware/middleware');
const CreateMeetupController = require('../controllers/createMeetup');

router
  .route('/')
  .get(middleware.requireLogin, CreateMeetupController.createMeetup_get)
  .post(middleware.upload('meetups').any(), CreateMeetupController.createMeetup_post);

module.exports = router;
