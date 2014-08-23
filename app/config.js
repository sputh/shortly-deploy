var host = process.env.HOST;
var user = process.env.user;
var password = process.env.password;
var databaseUrl = 'mydb';

var crypto = require('crypto');
var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var path = require('path');

// mongoose.connect()

var db = mongoose.createConnection(databaseUrl);
module.exports = db;

// db.createCollection('urls', function(err, collection) {
//   if(err) {
//     console.log(err)
//   }
//   console.log('Created table', collection)
// });
// db.createCollection('users', function(err, collection) {
//   if(err) {
//     console.log(err)
//   }
//   console.log('Created table', collection)
// });

// module.exports.urls = db.collection('urls');
// module.exports.users = db.collection('users');


