const express = require('express');
const coreUsuario = require('../../controller/core/coreUsuario');
var router = express.Router();
const bcrypt = require('bcrypt');
const security = require('../../config/security')
var middleware = require('../../config/middleware.js');

var instance = new coreUsuario();



router.post('/login', function (req, res, next) {
    instance.conUserNick(req.body).then(async resp => {
        console.log('resp' , resp.rows.length )
        //let data = {};
        if(resp.rows.length > 0){
            console.log('mayor a cero'  )
            if(resp.rows.length === 0)
            // var data = resp.rows[0];
            if(!bcrypt.compareSync(req.body.clave, resp.rows[0].clave)) throw new Error('Datos de usuario incorrectos..');
            //data.clave = null;
            //data.idsesion = await auditoria.insSesion(data.id, req, req.body.plataforma)
            resp.rows[0].token = security.createToken(resp.rows[0]);
            //await auditoria.updateToken(data);
            //console.log(data.idsesion)
            console.log('token->',resp.rows[0].token)
            res.status(200).send(resp.rows[0]) //data
        }else{
            throw new Error('Datos de usuario incorrectos');
        }
       
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/opcionesmenubyidusuario/:id', function(req, res, next) {
    instance.getOpcionesMenubyIdUsuario(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})



/*
router.post('/updatepassword', middleware.ensureAuthenticated, function (req, res, next) {
    objetox.updatePassword(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/logout', middleware.ensureAuthenticated, function (req, res, next) {
    auditoria.updateFechaSalida(req.user).then(async resp => {
        res.status(200).send({mensaje:1})
    }).catch(err => {
        res.status(400).send(err.message)
    })
})



router.get('/version',  function (req, res, next) {
    //nivel:1 
    //nivel:2 Abrir Inmediato
    res.status(200).send({ version:"1.0.28", nivel:2 }) //1.0.28
}) */



module.exports = router