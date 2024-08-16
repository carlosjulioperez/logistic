const express = require('express');
const coreGrupo = require('../../controller/tm/tmUnidadMedida');
var router = express.Router();
var middleware = require('../../config/middleware.js');
var instance = new coreGrupo();

//router.use(middleware.ensureAuthenticated);

router.get('/', function(req, res, next) {
    instance.getAll().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

module.exports = router