const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (mail, passwd) => {
  return new Promise(async (resolve, reject) => {
    try {
      // get user by mail
      const user = await User.findOne({ mail });
      // match password
      bcrypt.compare(passwd, user.passwd, (err, isMatch) => {
        if (err) {
          throw err;
        } else if (isMatch) {
          resolve(user);
        } else {
          // password does not match
          reject('帳號或密碼錯誤');
        }
      });
    } catch (error) {
      reject('帳號或密碼錯誤');
    }
  });
};
