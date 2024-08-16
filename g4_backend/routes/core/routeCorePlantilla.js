const express = require('express');
const corePlantilla = require('../../controller/core/corePlantilla');
var router = express.Router();
var middleware = require('../../config/middleware.js');
var instance = new corePlantilla();

//router.use(middleware.ensureAuthenticated);

router.get('/', function(req, res, next) {
    instance.getAllPlantillaTm().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


router.get('/plantilladetallebyidcab/:id', function(req, res, next) {
    instance.getPlantillaTmDetalleByIdCab(req.params.id).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})
 
router.get('/datosmaestrosbyid/:id/:columnasupdateselect/:tabla/:idplantilla', function(req, res, next) {
    instance.getDatosTablaMaestraById(req.params.id , req.params.columnasupdateselect , req.params.tabla  , req.params.idplantilla).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/single/:id', function(req, res, next) {
    instance.getObjectPlantillaTmById(req.params.id).then(resp => {
        res.status(200).send(resp.rows[0])
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/update/:id/:estado', function(req, res, next) {
    instance.updatePlantillaTm(req.params.id , req.params.estado).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/updatetablamaestraestado/:tablanombre/:id/:estado', function(req, res, next) {
    instance.updateEstadoTablaMaestra(req.params.tablanombre , req.params.id , req.params.estado).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/', function(req, res, next) {
    instance.createOrUpdatePlantillaTm(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/savedetallemaestro', function(req, res, next) {
    instance.createOrUpdatePlantillaDetalle(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

module.exports = router