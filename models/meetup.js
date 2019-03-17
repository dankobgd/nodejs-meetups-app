const mongoose = require('mongoose');

const {Schema} = mongoose;

// Meetup Schema
const meetupSchema = Schema({
  title: String,
  location: String,
  description: String,
  imageUrl: String,
  date: {type: Date, default: Date.now()},
  createdAt: {type: Date, default: Date.now()},
  geolocation: {
    formatted_address: String,
    lat: Number,
    lng: Number,
  },
  creatorId: {type: Schema.Types.ObjectId, ref: 'User'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
});

module.exports = mongoose.model('Meetup', meetupSchema);
