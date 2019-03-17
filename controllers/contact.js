const mailgun = require('mailgun-js');
const config = require('../config');

mailgun({apiKey: config.email.apiKey, domain: config.email.domain});

//  Get contact page
module.exports.contact_get = (req, res, next) => {
  res.render('user/contact', {user: req.user, title: 'Contact'});
};

//  Post contact page
module.exports.contact_post = (req, res, next) => {
  const html = `
      <h3>Meetups message info</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>E-mail: ${req.body.email}</li>
        <li>Subject: ${req.body.subject}</li>
        <li>Message: ${req.body.message}</li>
      </ul>`;

  const data = {
    from: `Meetups App ${config.email.from}`,
    to: config.email.to,
    subject: req.body.subject,
    html,
  };

  mailgun.messages().send(data, (error, body) => {
    if (error) console.log(error);
  });

  const response = `${req.body.name}, thank you for contacting us!`;
  res.render('user/contact', {response});
};
