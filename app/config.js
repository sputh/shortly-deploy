var mongoose = require('mongoose');
var host = process.env.HOST || '127.0.0.1';
var path = require('path');

mongoose.connect(host);
// var db = mongoose.connection;

// module.exports = db;
