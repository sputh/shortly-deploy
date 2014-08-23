var db = require('../config');
var mongoose = require('mongoose')
// var crypto = require('crypto');


var linkSchema = new mongoose.Schema({
  url: String,
  title: String,
  visits: Number,
  code: String,
  created_at: { type: Date, default: Date.now },
  base_url: String
})


linkSchema.methods.generateCode= function(url){
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

// linkSchema.methods.remove= function(query) {
//   return db.urls.remove(query)
// }

var Link = db.model("Link", linkSchema);
module.exports = Link;
