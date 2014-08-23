var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
})

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('stored password',this.password)
  return bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    return callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
  .then(function(hash) {
    this.model('User').update({username : this.username}, {password: hash}, function(err, doc){
      if(err){
       console.log('err', err)
      }
      console.log('hashed password')
    })
  })
}

var User = mongoose.model('User', userSchema);
module.exports = User;
