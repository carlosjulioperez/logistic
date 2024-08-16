const express = require('express');
const coreGrupo = require('../../controller/core/coreGrupo');
var router = express.Router();

var instance = new coreGrupo();

router.get('/', function(req, res, next) {
    instance.getAll().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/single/:id', function(req, res, next) {
    instance.getObjectById(req.params.id).then(resp => {
        res.status(200).send(resp.rows[0])
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

router.post('/', function(req, res, next) {
    instance.createOrUpdate(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

module.exports = router