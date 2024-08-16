const express = require("express");
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')

const hostname = 'localhost';
//const hostname = '26.13.143.178';

const port = 3000;


//Definition of routes
var routeCoreGrupo = require('./routes/core/routeCoreGrupo');
var routeCoreUsuario = require('./routes/core/routeCoreUsuario');
var routeTmUnidadMedida = require('./routes/tm/routeTmUnidadMedida');
var routeCorePlantilla = require('./routes/core/routeCorePlantilla');
var routePlanificacionAguaje=require('./routes/planificacion/routePlanificacionAguaje');
var routePlanificacionPrograma=require('./routes/planificacion/routePlanificacionPrograma');
var routeDashboard=require('./routes/dashboard/routeGraficoPlanificacionPrograma');
var routeLogisticaDespacho=require('./routes/logistica/routeLogisticaDespacho');


app.use(cors())
// app.set('trust proxy', true)
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10mb', extended: true }))

//app.use('/public', express.static('public'));
app.use('/public', express.static(__dirname + '/public' ));

 
//Call Routes 
app.use('/coregrupo',routeCoreGrupo);
app.use('/coreusuario',routeCoreUsuario);
app.use('/tmunidadmedida',routeTmUnidadMedida);
app.use('/coreplantilla',routeCorePlantilla);
app.use('/planificacionAguaje',routePlanificacionAguaje); 
app.use('/planificacionPrograma',routePlanificacionPrograma); 
app.use('/home',routeDashboard); 
app.use('/planificacionaguaje',routePlanificacionAguaje); 
app.use('/planificacionprograma',routePlanificacionPrograma); 
app.use('/logisticadespacho',routeLogisticaDespacho); 


// Una vez definidas nuestras rutas podemos iniciar el servidor
app.listen(port, err => {
    if (err) {
        // Aquí manejar el error
        console.error("Error listening: ", err);
        return;
    }
    // Si no se detuvo arriba con el return, entonces todo va bien ;)
    console.log(`Servidor Express listening in http://${hostname}:${port}/`);
});

/*
app.listen(port, () => {
    console.log(`Servidor Express en http://${hostname}:${port}/`);
});
*/