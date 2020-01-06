const path = require('path');
const url = require('url');
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

    const shop = new Shop({
      ...req.body,
      types: JSON.parse(req.body.types),
      businessHours: JSON.parse(req.body.businessHours),
      latLong: JSON.parse(req.body.latLong),
    });
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
  server.get('/search', async (req, res, next) => {
    try {
      const shops = await Shop.find();
      const copyShop = shops.map(shop => ({
        tags: shop.types,
        storename: shop.storename,
        city: shop.city,
        district: shop.district,
        address: shop.address,
        latLong: shop.latLong,
        star: Math.random() * 4 + 1,
        businessHours: shop.businessHours,
        tel: shop.tel,
        storeId: shop._id.toString(),
        createdData: new Date(shop.createdAt.toString())
          .toISOString()
          .split('T')[0],
        slogan: shop.slogan,
        logo: shop.logo,
      }));
      res.send(copyShop);
      next();
    } catch (error) {
      return next(new errors.InternalError(error.message));
    }
  });

  //get shop detail
  server.get('/storeDetail', async (req, res, next) => {
    const { store_id } = req.query;
    try {
      const shop = await Shop.findById(store_id);
      const copyShop = {
        storename: shop.storename,
        tags: Object.keys(shop.types),
        star: Math.random() * 4 + 1,
        slogan: shop.slogan,
        businessHours: shop.businessHours,
        tel: shop.tel,
        address: shop.address,
        pictures: [],
        comments: [],
      };
      res.send(copyShop);
      next(shop);
    } catch (error) {
      return next(new errors.InternalError(error.message));
    }
  });
};
