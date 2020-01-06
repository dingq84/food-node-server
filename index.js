const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');
const corsMiddleware = require('restify-cors-middleware');
const server = restify.createServer();

// Middleware
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
// server.use(restify.plugins.multipartBodyParser());
const cors = corsMiddleware({
  // origins: ['*'],
  allowHeaders: ['Authorization'],
  exposeHeaders: ['Authorization'],
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(
  rjwt({ secret: config.JWT_SECRET }).unless({
    path: [
      '/login',
      '/logout',
      '/storeDetail',
      '/signup',
      '/search',
      '/resetPassword',
    ],
  })
);

server.listen(config.PORT, () => {
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

const db = mongoose.connection;

db.on('error', error => {
  console.log(error);
});

db.once('open', () => {
  require('./routes/user')(server);
  require('./routes/shop')(server);
  console.log(`Server started on port ${config.PORT}`);
});
