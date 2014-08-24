var mongoose = require('mongoose');
var host = process.env.HOST || 'mongodb://MongoLab-v2:db5lARkfXIfYoYru2AW0BdZog8CG2uq8vk78bCiZZVQ-@ds050077.mongolab.com:50077/MongoLab-v2'|| '127.0.0.1';
var path = require('path');

mongoose.connect(host);
// var db = mongoose.connection;

// module.exports = db;
