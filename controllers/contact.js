const config = require('../config');

const mailer = require('../config/mailer');

//  Get contact page
module.exports.contact_get = (req, res, next) => {
  res.render('user/contact', {user: req.user, title: 'Contact'});
};

//  Post contact page
module.exports.contact_post = (req, res, next) => {
  const html = `
    <h3>Meetups contact info</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>E-mail: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
      <li>Message: ${req.body.message}</li>
    </ul>`;

  const options = {
    from: req.body.email,
    to: config.email.from,
    subject: req.body.subject,
    html,
  };

  mailer.sendMail(options, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(400).send({success: false});
    }

    const response = `${req.body.name}, thank you for contacting us!`;
    res.render('user/contact', {response});
  });
};
