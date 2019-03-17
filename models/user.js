const mongoose = require('mongoose');

const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  registeredMeetups: [{type: Schema.Types.ObjectId, ref: 'Meetup'}],
});

//  Encrypt password before saving the model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(14);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

//  Check if passwords match
userSchema.methods.validPassword = function(pw) {
  return bcrypt.compareSync(pw, this.password);
};

module.exports = mongoose.model('User', userSchema);
