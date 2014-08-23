var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}).exec(function(err, docs) {
    res.send(200, docs);
  })
};

var hashUrl = function(url){
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  var hashedUrl = shasum.digest('hex').slice(0, 5);
  return hashedUrl
}

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }).exec(function(err, docs) {
    if (docs) {
      console.log('found link')
      res.send(200, docs);
    } else {
      console.log('didnt find link')
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin,
          code: hashUrl(uri),
          visits: 0
        });

        link.save(function(err, newLink) {
          if(err){
            return console.log('error')
          }
          // newLink.hashUrl(),
          res.send(200, newLink);
        });
      })
    }
  })
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
  .exec(function(err, docs) {
    if (!docs) {
      res.redirect('/login');
    } else {
      docs.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, docs);
        } else {
          res.redirect('/');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username })
  .exec(function(err, docs) {
    if(!!!docs) {
      console.log('Account already exists');
      res.redirect('/signup');
    } else {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save(function(err, newUser) {
        if(err) {
          return console.log('error')
        }
        newUser.hashPassword();
        util.createSession(req, res, newUser);
      });
    }
  })
};

exports.navToLink = function(req, res) {
  // console.log('req',req)
  Link.findOne({ code: req.params[0] }).exec(function(err, docs) {
    if (!docs) {
      console.log('didnt find link nav to link')
      res.redirect('/');
    } else {
      console.log('nav to link', docs)
      docs.update({ $inc: { views: 1 } }).exec(function(err, docs) {
        console.log('docs',docs)
      });
      return res.redirect(docs.url);
    }
  });
};
