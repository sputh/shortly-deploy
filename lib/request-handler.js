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
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  if(Link.find({ url: uri })){
    res.send(200, Link.find({ url: uri}));
  }else {
    util.getUrlTitle(uri, function(err, title) {
      if (err) {
        console.log('Error reading URL heading: ', err);
        return res.send(404);
      }

      var link = new db.Link({
        url: uri,
        title: title,
        visits: 0,
        code: db.Link.generateCode(uri),
        base_url: req.headers.origin
      });

      link.save(function(err, newLink) {
        res.send(200, newLink);
      });
    });
  }
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (!db.User.find({ username: username })) {
      res.redirect('/login');
  } else {
    User.comparePassword(username, password, function(match) {
      if (match) {
        util.createSession(req, res, user);
      } else {
        res.redirect('/login');
      }
    })
  }
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (db.User.find({ username: username })) {
      console.log('Account already exists');
      res.redirect('/signup');
  } else {
    var user = new User({
      username: username,
      password: user.hashPassword(password)
    });

    user.save(function(err, newUser) {
      util.createSession(req, res, newUser)
    });
  }
};

exports.navToLink = function(req, res) {
  if (!db.Link.find({ code: req.params[0] })) {
    res.redirect('/');
  } else {
    db.Link.update({ code: req.params[0] }, {$inc: { visits: 1 }}, function(err, count) {
      console.log('nav redirect:', db.Link.find({ code: req.params[0] }, { url : 1 }))
      return res.redirect(db.Link.find({ code: req.params[0] }, { url : 1 }));
    });
  }
};
