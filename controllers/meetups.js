const Meetup = require('../models/meetup');
const {asyncWrap} = require('../middleware/middleware');

//  Get meetups page
module.exports.meetups_get = asyncWrap(async (req, res, next) => {
  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    const searchedMeetups = await Meetup.find({title: regex});

    if (searchedMeetups.length <= 0) {
      const noMatch = 'No items matching your search criteria have been found';
      res.render('meetup/meetups', {noMatch});
    } else {
      res.render('meetup/meetups', {meetups: searchedMeetups});
    }
  } else {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 32;
    const skip = (page - 1) * limit;

    const meetups = await Meetup.find()
      .sort({date: 1})
      .limit(limit)
      .skip(skip);

    const count = await Meetup.count();
    const pageCount = Math.ceil(count / limit);
    const pagination = {count, page, limit, skip, pageCount};

    res.render('meetup/meetups', {
      title: 'Meetups',
      meetups,
      pagination,
    });
  }
});
