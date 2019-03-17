const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const Meetup = require('../models/meetup');
const {asyncWrap} = require('../middleware/middleware');
const config = require('../config');

//  Create meetup page get
module.exports.createMeetup_get = (req, res, next) => {
  res.render('meetup/createMeetup', {title: 'Create Meetup'});
};

//  Create meetup page post
module.exports.createMeetup_post = asyncWrap(async (req, res, next) => {
  if (req.fileFilterError) {
    return res.render('meetup/createMeetup', {fileFilterError: req.fileFilterError});
  }

  if (req.files[0].size > 3 * 1024 * 1024) {
    const fileSizeError = 'File size too large. Max size limit: 3MB';
    return res.render('meetup/createMeetup', {fileSizeError});
  }

  const {filename: imgName, path: imgPath} = req.files[0];

  function submittableDate() {
    const newDate = new Date(req.body.datepicker);
    const time = req.body.timepicker.split(':');
    const hours = time[0];
    const minutes = time[1];
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate;
  }

  const geocodeURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.location}&key=${
    config.googleMaps.apiKey
  }`;
  const response = await fetch(geocodeURL);
  const data = await response.json();

  if (data.status === 'ZERO_RESULTS') {
    const invalidLocation = 'No Google Maps Available for this location, please enter a valid address';
    return res.render('meetup/createMeetup', {invalidLocation});
  }

  /* eslint-disable camelcase */
  if (data.status === 'OK') {
    const {
      formatted_address,
      geometry: {
        location: {lat, lng},
      },
    } = data.results[0];

    const meetupObj = {
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      date: submittableDate().toISOString(),
      geolocation: {formatted_address, lat, lng},
      creatorId: req.user._id,
      createdAt: Date.now(),
      imageUrl: imgPath,
    };

    const meetup = new Meetup(meetupObj);

    meetup.save((err, mtp) => {
      if (err) console.log(err);
      req.session.success = 'Meetup Created';
      res.redirect(`/meetup/${mtp._id}`);
    });
  }
});
