var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');


var linkSchema = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number,
  createdAt: { type: Date, default: Date.now }
})

// linkSchema.methods

var Link = mongoose.model('Link', linkSchema);
module.exports = Link;
