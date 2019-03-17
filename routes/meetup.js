const express = require('express');

const router = express.Router();
const MeetupController = require('../controllers/meetup');

router
  .route('/:id')
  .get(MeetupController.meetup_get)
  .put(MeetupController.edit_info)
  .post(MeetupController.edit_date_time)
  .patch(MeetupController.register_unregister)
  .delete(MeetupController.meetup_delete);

router
  .route('/:id/comments')
  .post(MeetupController.post_comment)
  .put(MeetupController.edit_comment)
  .delete(MeetupController.delete_comment);

module.exports = router;
