const express = require('express');
const planificacionPrograma = require('../../controller/planificacion/planificacionPrograma');
var router = express.Router();
var middleware = require('../../config/middleware.js');
var instance = new planificacionPrograma();

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

router.get('/programabyidaguaje/:id', function(req, res, next) {
    instance.getProgramabyIdAguaje(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//10-12-2023 para usar en pantalla control de bines - lista las fechas de despacho
router.get('/programafechadespachobyidaguaje/:id', function(req, res, next) {
    instance.getProgramaFechaDespachobyIdAguaje(req.params.id).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//10-12-2023 para usar en pantalla control de bines
router.get('/programabyidaguajeandfechadespacho/:id/:fechadespacho', function(req, res, next) {
    instance.getProgramabyIdAguajeAndFechaDespacho(req.params.id  , req.params.fechadespacho).then(resp => {
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

router.get('/programabyidaguajeandidclienteandfechadespacho/:idaguaje/:idcliente/:fechadespacho', function(req, res, next) {
    instance.getProgramabyIdAguajeAndIdClienteV2AndFechaDespacho(req.params.idaguaje , req.params.idcliente , req.params.fechadespacho ).then(resp => {
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


router.get('/sociedad/', function(req, res, next) {
    instance.getSociedad().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/sociedadbyid/:idsociedad', function(req, res, next) {
    instance.getSociedadById(req.params.idsociedad).then(resp => {
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

router.get('/proveedorbyidtipo/:idproveedortipo', function(req, res, next) {
    instance.getProveedorByIdtipo(req.params.idproveedortipo ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/empleadobyidcargo/:idcargoempleado', function(req, res, next) {
    instance.getEmpleadoByIdCargo(req.params.idcargoempleado ).then(resp => {
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

router.get('/sucursal/', function(req, res, next) {
    instance.getSucursal().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/tipometabisulfito/', function(req, res, next) {
    instance.getTipoMetabisulfito().then(resp => {
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

router.get('/muelle/', function(req, res, next) {
    instance.getMuelle().then(resp => {
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