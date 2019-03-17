const Meetup = require('../models/meetup');
const User = require('../models/user');
const Comment = require('../models/comment');
const {asyncWrap} = require('../middleware/middleware');

//  GET meetup page
module.exports.meetup_get = asyncWrap(async (req, res, next) => {
  const meetup = await Meetup.findById(req.params.id);
  const promises = meetup.comments.map(cid => Comment.findById(cid));
  const comments = await Promise.all(promises);
  const users = await User.find();
  const creator = await User.findById(meetup.creatorId);
  const registeredUsersList = users.filter(user =>
    user.registeredMeetups.findIndex(mid => mid == req.params.id) >= 0 ? user : null
  );

  const userIsRegistered = () => !!(req.user && req.user.registeredMeetups.findIndex(mid => mid == req.params.id) >= 0);
  const userIsCreator = () => !!(req.user && req.user._id.toString() === meetup.creatorId.toString());

  const arr = comments.map(c => User.findById(c.authorId));
  const authors = await Promise.all(arr);

  const combinedValues = comments.map((item, i) => ({
    _id: item._id,
    postedAt: item.postedAt,
    text: item.text,
    author: authors[i],
  }));

  const meetupProperties = {
    title: 'Meetup',
    user: req.user,
    meetup,
    creator,
    comments: combinedValues,
    userIsCreator: userIsCreator(),
    userIsRegistered: userIsRegistered(),
    registeredUsersList,
  };

  if (!meetup) {
    const meetupNotFound = {meetupNotFound: "Meetup with this ID doesn't exist"};
    return res.format({
      html: () => res.render('meetup/meetup', meetupNotFound),
      json: () => res.json(meetupNotFound),
    });
  }

  res.format({
    html: () => res.render('meetup/meetup', meetupProperties),
    json: () => res.json(meetupProperties),
  });
});

//  PUT meetup edit info (title, loc, desc)
module.exports.edit_info = asyncWrap(async (req, res, next) => {
  const {newTitle, newLocation, newDescription} = req.body;

  const editedMeetup = {
    title: newTitle,
    location: newLocation,
    description: newDescription,
  };

  if (newTitle.trim() !== '' && newLocation.trim() !== '' && newDescription.trim() !== '') {
    await Meetup.findByIdAndUpdate(req.params.id, {$set: editedMeetup});
    res.json({success: true});
  }
});

//  POST meetup edit date and time
module.exports.edit_date_time = asyncWrap(async (req, res, next) => {
  const editedDate = new Date(req.body.editedDate);
  const {editedTime} = req.body;

  const currentMeetup = await Meetup.findById(req.params.id);

  const oldDate = new Date(currentMeetup.date);
  const newDate = new Date(oldDate);

  if (editedDate !== '') {
    const month = editedDate.getMonth();
    const date = editedDate.getDate();
    const year = editedDate.getFullYear();
    newDate.setMonth(month);
    newDate.setDate(date);
    newDate.setFullYear(year);
  }

  if (editedTime !== '') {
    const hours = editedTime.split(':')[0];
    const minutes = editedTime.split(':')[1];
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
  }

  await Meetup.findByIdAndUpdate(req.params.id, {$set: {date: newDate}});
  res.json({newDate});
});

//  PATCH meetup register/unregister action
module.exports.register_unregister = asyncWrap(async (req, res, next) => {
  const userIsRegistered = () => req.user && req.user.registeredMeetups.findIndex(mid => mid == req.params.id) >= 0;

  if (!userIsRegistered()) {
    await User.findByIdAndUpdate(req.user._id, {$push: {registeredMeetups: req.params.id}});
    res.json({success: true});
  } else {
    await User.findByIdAndUpdate(req.user._id, {$pull: {registeredMeetups: req.params.id}});
    res.json({success: true});
  }
});

//  DELETE meetup and its comments
module.exports.meetup_delete = asyncWrap(async (req, res, next) => {
  const meetup = await Meetup.findByIdAndRemove(req.params.id);
  const promises = meetup.comments.map(cid => Comment.findByIdAndRemove(cid));
  await Promise.all(promises);
  const users = await User.find();

  users.forEach(user => {
    if (user.registeredMeetups.findIndex(mid => mid == req.params.id) >= 0) {
      User.findByIdAndUpdate(user._id, {$pull: {registeredMeetups: req.params.id}});
    }
  });

  res.redirect(303, '/');
});

//  POST comment
module.exports.post_comment = asyncWrap(async (req, res, next) => {
  const {newComment, authorId} = req.body;
  const meetup = await Meetup.findById(req.params.id);

  const comment = new Comment({
    authorId,
    text: newComment,
    postedAt: Date.now(),
  });

  meetup.comments.push(comment);
  await meetup.save();
  await comment.save();
  req.session.success = 'Comment added';
  res.render('meetup/meetup');
});

//  EDIT comment
module.exports.edit_comment = asyncWrap(async (req, res, next) => {
  const {updatedComment, commentId} = req.body;
  if (updatedComment !== '') {
    await Comment.findByIdAndUpdate(commentId, {$set: {text: updatedComment}});
    res.json({success: true});
  }
});

//  DELETE comment
module.exports.delete_comment = asyncWrap(async (req, res, next) => {
  const {commentId, meetupId} = req.body;
  await Comment.findByIdAndRemove(commentId);
  await Meetup.findByIdAndUpdate(meetupId, {$pull: {comments: commentId}});
  res.json({success: true});
});
