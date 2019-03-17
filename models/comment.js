const mongoose = require('mongoose');

const {Schema} = mongoose;

// Comment Schema
const commentSchema = Schema({
  authorId: {type: Schema.Types.ObjectId, ref: 'User'},
  text: String,
  postedAt: {type: Date, default: Date.now()},
});

module.exports = mongoose.model('Comment', commentSchema);
