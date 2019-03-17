const express = require('express');

const router = express.Router();
const ContactController = require('../controllers/contact');

router
  .route('/')
  .get(ContactController.contact_get)
  .post(ContactController.contact_post);

module.exports = router;
