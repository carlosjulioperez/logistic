const express = require('express');
const planificacionAguaje = require('../../controller/planificacion/planificacionAguaje');
var router = express.Router();
var middleware = require('../../config/middleware.js');
var instance = new planificacionAguaje();

//router.use(middleware.ensureAuthenticated);

router.get('/', function(req, res, next) {
    instance.getAll().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


router.get('/update/:id/:estado', function(req, res, next) {
    instance.update(req.params.id , req.params.estado).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})
router.get('/buscaraguajebyid/:id', function(req, res, next) {
    instance.buscarAguajebyId(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


router.post('/', function(req, res, next) {
    instance.create(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

module.exports = router