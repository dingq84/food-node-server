const errors = require('restify-errors');
const User = require('../models/User');

module.exports = server => {
  // get user
  server.get('/user', async (req, res, next) => {
    try {
      const user = await User.find({});
      res.send(user);
      next();
    } catch (error) {
      return next(new errors.InvalidContentError(error));
    }
  });

  // create user
  server.post('/user', async (req, res, next) => {
    // check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError('Expects "application/json"'));
    }

    // req.body data
    const { username, mail, passwd, birthyear, sexual } = req.body;

    const user = new User({
      username,
      passwd,
      mail,
      birthyear,
      sexual,
    });

    try {
      const newUser = await user.save();
      res.send(201);
      next();
    } catch (error) {
      return next(new errors.InternalError(err.message));
    }
  });
};
