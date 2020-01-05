const mogoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const ShopTypeSchema = new mogoose.Schema({
  major: {
    type: String,
    require: true,
    trim: true,
  },
  minor: {
    type: Array,
    require: true,
  },
});

ShopTypeSchema.plugin(timestamp);

const ShopType = mogoose.model('ShopType', ShopTypeSchema);

module.exports = ShopType;
