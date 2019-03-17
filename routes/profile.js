const express = require('express');

const router = express.Router();
const middleware = require('../middleware/middleware');
const ProfileController = require('../controllers/profile.js');

router.get('/:id', ProfileController.profile_get);
router.post('/:id/updateInfo', middleware.upload('avatars').any(), ProfileController.update_profile_info);
router.post('/:id/updatePassword', ProfileController.update_profile_password);

module.exports = router;
