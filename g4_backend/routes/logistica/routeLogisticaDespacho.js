const express = require('express');
const logisticaDespachos = require('../../controller/logistica/logisticaDespachos'); 
var router = express.Router();
var middleware = require('../../config/middleware.js');
var instance = new logisticaDespachos();


//router.use(middleware.ensureAuthenticated);

router.get('/programadetallelogisticabyidaguaje/:id', function(req, res, next) {
    instance.getProgramaDetalleLogisticabyIdAguaje(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/programadetallelogisticabyidaguajeandfechadespacho/:id/:fechadespacho', function(req, res, next) {
    instance.getProgramaDetalleLogisticabyIdAguajeAndFechaDespacho(req.params.id , req.params.fechadespacho ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


router.get('/informacionmovilesbyidplanificaciondetalle/:id', function(req, res, next) {
    instance.getInformacionMovilesbyIdPlanificacionDetalle(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//24-02-2024
router.get('/programadetallelogisticabyidaguajeexport/:id', function(req, res, next) {
    instance.getProgramaDetalleLogisticabyIdAguajeExport(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/programadetallelogisticabyidaguajeandfechadespachoexport/:id/:fechadespacho', function(req, res, next) {
    instance.getProgramaDetalleLogisticabyIdAguajeAndFechaDespachoExport(req.params.id , req.params.fechadespacho ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//29-05-2024
router.get('/programadetallelogisticamonitorbyidaguajeexport/:id', function(req, res, next) {
    instance.getProgramaDetalleLogisticaMonitorbyIdAguajeExport(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


router.get('/programadetallelogisticamonitorbyidaguajeandfechadespachoexport/:id/:fechadespacho', function(req, res, next) {
    instance.getProgramaDetalleLogisticaMonitorbyIdAguajeAndFechaDespachoExport(req.params.id , req.params.fechadespacho ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


router.get('/impresiondocumentosbyidaguaje/:id', function(req, res, next) {
    instance.getImpresionDocumentosbyIdAguaje(req.params.id ).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

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

router.get('/biologo/', function(req, res, next) {
    instance.getBiologo().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/binesdisponibles/', function(req, res, next) {
    instance.getBinesDisponibles().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


//modifica
router.post('/logisticadespachoupdate', function (req, res, next) {
    instance.updateLogisticaDespacho(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//modifica materiales
router.post('/logisticadespachomaterialupdate', function (req, res, next) {
    instance.updateLogisticaDespachoMaterial(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

//crea el objeto solo con el idplanificaciondetalle , la fecha de registro , usuario
// los demas campos se actualizan con el metodo logisticadespachoupdate
router.post('/logisticadespachocreateempty', function(req, res, next) {
    instance.createLogisticaDespachoEmpty(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/updatecampo', function(req, res, next) {
    instance.createLogisticaDespachoEmpty(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

/*
router.get('/downloadV1/:iddocumento/:tipo',function(req, res, next) {
    instance.getArchivoTipoV1(req.params.iddocumento, req.params.tipo).then(p=>{
        //res.send(p);
        res.download(p);
    }).catch(err => {
        res.status(400).send(err.message)
    })
});*/

router.get('/download/:iddocumento/:tipo/:idsociedad',function(req, res, next) {
    console.log('recibio idsociedad ->' + req.params.idsociedad)
    instance.getArchivoTipo(req.params.iddocumento, req.params.tipo , req.params.idsociedad  ).then(p=>{
        //res.send(p);
        res.download(p);
    }).catch(err => {
        res.status(400).send(err.message)
    })
});
 

/*
router.get('/download1/:iddocumento/:tipo/:rutapdf/:rutaxml',function(req, res, next) {
    console.log('recibio para descargar rutapdf ->' + rutapdf)
    instance.getArchivoTipo(req.params.iddocumento, req.params.tipo , req.params.rutapdf, req.params.rutaxml ).then(p=>{
        //res.send(p);
        res.download(p);
    }).catch(err => {
        res.status(400).send(err.message)
    })
});*/

router.post('/generalogisticadespachoguia', function(req, res, next) {
    instance.createOrUpdateLogisticaDespachoGuia(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/updateautorizacionlogisticadespachoguia', function(req, res, next) {
    instance.updateAutorizacionLogisticaDespachoGuia(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.post('/updateanularlogisticadespachoguia', function(req, res, next) {
    instance.updateAnularLogisticaDespachoGuia(req.body).then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})

router.get('/empresa/', function(req, res, next) {
    instance.getDatosEmpresa().then(resp => {
        res.status(200).send(resp)
    }).catch(err => {
        res.status(400).send(err.message)
    })
})


module.exports = router