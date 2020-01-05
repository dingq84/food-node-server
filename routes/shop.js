const path = require('path');
const errors = require('restify-errors');
const ShopType = require('../models/ShopType');
const Shop = require('../models/Shop');
const file = require('../copyfile');

module.exports = server => {
  // get shop types
  server.get('/getStoreTypes', async (req, res, next) => {
    try {
      const shopTypes = await ShopType.find();
      const data = shopTypes.reduce(
        (accu, curr) => ({ ...accu, [curr.major]: curr.minor }),
        {}
      );
      res.send(data);
      next();
    } catch (error) {
      return next(new errors.InternalError(error));
    }
  });
  // create shop types for testing
  server.post('/getStoreTypes', async (req, res, next) => {
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError('Expects "application/json"'));
    }
    const { major, minor } = req.body;
    const shopType = new ShopType({ major, minor });

    try {
      await shopType.save();
      res.end('success');
      next();
    } catch (error) {
      return next(new errors.InternalError(error.message));
    }
  });
  // create shop
  server.post('/createStore', async (req, res, next) => {
    if (!req.is('multipart/form-data')) {
      return next(
        new errors.InvalidContentError('Expects "multipart/form-data"')
      );
    }

    const shop = new Shop({ ...req.body });
    for (let key in req.files) {
      if (req.files.hasOwnProperty(key)) {
        const oldPath = req.files[key].path;
        const newPath = path.join(
          __dirname,
          `../images/${req.files[key].name}`
        );
        file.move(oldPath, newPath);
        shop[key] = newPath;
      }
    }
    try {
      await shop.save();
      res.end('success');
      next();
    } catch (error) {
      return next(new errors.InternalError(error.message));
    }
  });
  // search shop
  server.get('/search', async (req, res, next) => {});
};
