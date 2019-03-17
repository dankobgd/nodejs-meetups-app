require('dotenv').config();

const ENV = process.env.NODE_ENV || 'development';

const defaultConfig = {
  PORT: process.env.PORT || 3000,
};

const developmentConfig = {
  db: {
    url: process.env.DB_URI,
    options: {useNewUrlParser: true},
  },
  email: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
};

const productionConfig = {
  db: {
    url: process.env.DB_URI,
    options: {useNewUrlParser: true},
  },
  email: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
};

function getEnvironmentConfig(env) {
  switch (env) {
    case 'development':
      return developmentConfig;
    case 'production':
      return productionConfig;
    default:
      return productionConfig;
  }
}

module.exports = {
  ...defaultConfig,
  ...getEnvironmentConfig(ENV),
};
