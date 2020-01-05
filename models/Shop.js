const mogoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ShopSchema = new mogoose.Schema({
  storename: {
    type: String,
    require: true,
    trim: true,
  },
  city: {
    type: String,
    require: true,
    trim: true,
  },
  district: {
    type: String,
    require: true,
    trim: true,
  },
  address: {
    type: String,
    require: true,
    trim: true,
  },
  tel: {
    type: String,
    require: true,
    trim: true,
  },
  businessHours: {
    type: Object,
    require: true,
    trim: true,
  },
  latLong: {
    type: Object,
    require: true,
    trim: true,
  },
  types: {
    type: Object,
    require: true,
    trim: true,
  },
  logo: {
    type: String,
    require: true,
    trim: true,
  },
  images: {
    type: String,
    require: true,
    trim: true,
  },
  slogan: {
    type: String,
    require: true,
    trim: true,
  },
});

ShopSchema.plugin(timestamp);

const Shop = mogoose.model('Shop', ShopSchema);

module.exports = Shop;
