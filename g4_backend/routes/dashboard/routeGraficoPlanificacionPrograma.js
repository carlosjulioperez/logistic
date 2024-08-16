const express = require('express');
const planificacionPrograma = require('../../controller/dashboard/graficoPlanificacionPrograma');
var router = express.Router();

var instance = new planificacionPrograma();

router.get('/hieleras/:id', function(req, res, next) {
    instance.getHielerasGrafico(req.params.id).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
});

router.get('/puertos/:id', function(req, res, next) {
    instance.getPuertosGrafico(req.params.id).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
});

router.get('/clientes/:id', function(req, res, next) {
    instance.getClientesGrafico(req.params.id).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
});

router.get('/proveedores/:id', function(req, res, next) {
    instance.getProveedorGrafico(req.params.id).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
});

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

router.get('/eprogramabyidaguaje/:id', function(req, res, next) {
    instance.getEProgramabyIdAguaje(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/eprogramabyidaguajetabla/:id', function(req, res, next) {
    instance.getEProgramabyIdAguajeTabla(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/programabyidaguajeandidcliente/:idaguaje/:idcliente', function(req, res, next) {
    instance.getProgramabyIdAguajeAndIdClienteV2(req.params.idaguaje , req.params.idcliente ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//para reporte
router.get('/planificacionprogramabyidaguaje/:id', function(req, res, next) {
    instance.getPlanificacionprogramaByIdAguaje(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

 
router.get('/programadetallelogisticabyidaguaje/:id', function(req, res, next) {
    instance.getProgramaDetalleLogisticabyIdAguaje(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
}) 

router.get('/tipoproceso/', function(req, res, next) {
    instance.getTipoProceso().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/proveedor/', function(req, res, next) {
    instance.getProveedorCamaron().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/proveedorpropiedad/', function(req, res, next) {
    instance.getProveedorPropiedad().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/proveedorbyidpropiedad/:idproveedorpropiedad', function(req, res, next) {
    instance.getProveedorByIdPropiedad(req.params.idproveedorpropiedad ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/proveedorcamaronbyidpropiedad/:idproveedorpropiedad', function(req, res, next) {
    instance.getProveedorCamaronByIdpropiedad(req.params.idproveedorpropiedad ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/comprador/', function(req, res, next) {
    instance.getComprador().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/sector/', function(req, res, next) {
    instance.getSector().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/campamento/', function(req, res, next) {
    instance.getCampamento().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/metodocosecha/', function(req, res, next) {
    instance.getMetodoCosecha().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/piscina/', function(req, res, next) {
    instance.getPiscina().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/clientes/', function(req, res, next) {
    instance.getClientes().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//modifica
router.post('/planificaciondetalleupdate', function (req, res, next) {
    instance.updatePlanificacionProgramaDetalle(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/planificacioncabeceraupdate', function (req, res, next) {
    instance.updatePlanificacionProgramaCabecera(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/', function(req, res, next) {
    instance.createOrUpdateV2(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

module.exports = router