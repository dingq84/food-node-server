module.exports = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  URL: process.env.URL || 'http://localhost:3000',
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb+srv://admin:ding5802@restaurants-xcrls.mongodb.net/test?retryWrites=true&w=majority',
};
