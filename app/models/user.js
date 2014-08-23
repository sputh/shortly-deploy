var db = require('../config');
var mongoose = require('mongoose')
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now }
});

var User = db.model('User', userSchema);
// console.log(User)
User.comparePassword = function(username, attemptedPassword, callback) {
  var storedPassword = db.users.find({ username: username }, { password : 1 });
  bcrypt.compare(attemptedPassword, storedPassword, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.statics.hashPassword= function(password){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(password, null, null)
};

  // remove: function(query) {
  //   return db.users.remove(query)
  // }

module.exports = User;
