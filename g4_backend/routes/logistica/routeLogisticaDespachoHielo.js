const express = require('express');
const logisticaDespachosHielo = require('../../controller/logistica/logisticaDespachosHielo.js'); 
var router = express.Router();
var middleware = require('../../config/middleware.js');
var instance = new logisticaDespachosHielo();

router.get('/impresiondocumentosbyidaguajeandfechadespacho/:id/:fechadespacho', function(req, res, next) {
    instance.getImpresionDocumentosbyIdAguajeAndFechaDespacho(req.params.id , req.params.fechadespacho).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/transporte/', function(req, res, next) {
    instance.getTransporte().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

// //crea el objeto solo con el idplanificaciondetalle , la fecha de registro , usuario
// // los demas campos se actualizan con el metodo logisticadespachoupdate
router.post('/logisticadespachohielocreateempty', function(req, res, next) {
    instance.createLogisticaDespachoHieloEmpty(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/logisticadespachohielodetalledelete', function(req, res, next) {
    instance.deleteLogisticaDespachoHieloDetalle(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/logisticadespachohielodetalleupdate', function(req, res, next) {
    instance.updateLogisticaDespachoHieloDetalle(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/generalogisticadespachohieloguia', function(req, res, next) {
    instance.createOrUpdateLogisticaDespachoHieloGuia(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/updateautorizacionlogisticadespachohieloguia', function(req, res, next) {
    instance.updateAutorizacionLogisticaDespachoGuia(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/updateanularlogisticadespachohieloguia', function(req, res, next) {
    instance.updateAnularLogisticaDespachoHieloGuia(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

module.exports = router