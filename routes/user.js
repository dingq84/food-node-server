const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = server => {
  // login
  server.post('/login', async (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError('Expects "application/json"'));
    }

    const { mail, passwd } = req.body;
    try {
      const user = await auth.authenticate(mail, passwd);
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: '15m',
      });

      // const { iat, exp } = jwt.decode(token);
      res.send({ username: user.username, token });
      next();
    } catch (error) {
      return next(new errors.UnauthorizedError(error));
    }
  });

  // register user
  server.post('/signup', async (req, res, next) => {
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

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.passwd, salt, async (err, hash) => {
        // hash password
        user.passwd = hash;
        // save user
        try {
          const newUser = await user.save();
          // res.send(201, { username: newUser.username });
          const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
            // expiresIn: '15m',
          });

          // const { iat, exp } = jwt.decode(token);
          res.send({ username: newUser.username, token });
          next();
        } catch (error) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // logout
  server.post('/logout', (req, res, next) => {
    res.end();
    next();
  });
};
