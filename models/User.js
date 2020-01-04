const mogoose = require('mongoose');
const timestamp = require('mongoose-timestamp');

const UserSchema = new mogoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  mail: {
    type: String,
    require: true,
    trim: true,
  },
  passwd: {
    type: String,
    require: true,
    trim: true,
  },
  birthyear: {
    type: String,
    require: true,
    trim: true,
  },
  sexual: {
    type: String,
    require: true,
    trim: true,
  },
});

UserSchema.plugin(timestamp);

const User = mogoose.model('User', UserSchema);

module.exports = User;
