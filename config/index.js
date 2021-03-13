require('dotenv').config();

const ENV = process.env.NODE_ENV || 'development';

const defaultConfig = {
  PORT: process.env.PORT || 3001,
  SITE_URL: process.env.SITE_URL,
};

const developmentConfig = {
  db: {
    url: process.env.DB_URI,
    options: {useNewUrlParser: true, useUnifiedTopology: true},
  },
  email: {
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
    from: process.env.EMAIL_FROM,
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
    options: {useNewUrlParser: true, useUnifiedTopology: true},
  },
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
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
