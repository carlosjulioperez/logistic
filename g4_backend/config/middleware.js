//var jwt = require('jwt-simple');
var jwt = require('jsonwebtoken')
var moment = require('moment');
var sconfig = require('./sconfig');
//const pauditoria = require('../procesos/general/pauditoria')
//var auditoria = new pauditoria();

exports.ensureAuthenticated = function(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(403).send({message: "Acceso no autorizado"});
  }
  
  var token = req.headers.authorization.split(" ")[1];
  try {
    //var payload = jwt.decode(token, config.TOKEN_SECRET);  
    var payload = jwt.verify(token, sconfig.TOKEN_SECRET)
    //auditoria.updateUltimaConexion(payload)
  } catch (error) {
    return res.status(401).send({message: "La sesión ha finalizado."});
  }
  
  if(payload.exp <= moment().unix()) {
    //auditoria.updateFechaSalida(payload)
    delete sconfig.tokenList[payload.descripcion]
    return res.status(401).send({message: "La sesión ha finalizado."});
  }

  // if(!(payload.descripcion in sconfig.tokenList) || sconfig.tokenList[payload.descripcion] != token) {
  //   return res.status(401).send({message: "Sesión finalizada remotamente."});
  // }
  
  req.user = payload;
  next();
}
