const Meetup = require('../models/meetup');
const {asyncWrap} = require('../middleware/middleware');

module.exports.home_get = asyncWrap(async (req, res, next) => {
  const meetups = await Meetup.find()
    .sort({date: +1})
    .limit(5);
  res.render('home', {meetups, title: 'Meetups App'});
});
