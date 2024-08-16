//var jwt = require('jwt-simple');
var moment = require('moment');
var sconfig = require('../config/sconfig');
var jwt = require('jsonwebtoken');

exports.createToken = function(user) {
    
  var payload = {
    sub: user.id,
    iat: moment().unix(),
    // exp: moment().add(1, "days").unix(),
    exp: moment().add(10, "seconds").unix(),
  };

  //return jwt.encode(payload, config.TOKEN_SECRET);
  var token = jwt.sign(user, sconfig.TOKEN_SECRET, { expiresIn: '1d'});
  sconfig.tokenList[user.descripcion] = token;
  return token;

  
};