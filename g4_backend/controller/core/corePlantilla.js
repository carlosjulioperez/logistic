const db = require("../../config/db");



class corePlantilla {

    
    async getAllPlantillaTm() {
        let results = await db.query(`SELECT * FROM core_plantilla_tm where estado = 1 order by nombretm asc`)
                            .catch(console.log);
           
        return results.rows;
    }

    async getObjectPlantillaTmById(id) {
        let results = await db.query(`SELECT * FROM core_plantilla_tm where idplantillatm = $1 `,[id])
                            .catch(console.log);
        //console.log(results.rows);                 
        return results;
    }

    async getTablaMaestraByNombre(nombretabla) {
        let results = await db.query(`SELECT * FROM ${nombretabla} where estado = 1`)
                            .catch(console.log);
        //console.log(results.rows);                 
        return results;
    }

    async getPlantillaTmDetalleByIdCab(id) {

        /*  Valor codigomensaje
          * 1 OK          =>  Mensaje Personalizado de OK
          * 2 Advertencia =>  Mensaje Personalizado de Advertencia
          * 3 Error       =>  Mensaje Personalizado de Error
        */

        let objetoRespuesta = {objeto: {} , mensaje : '' , codigomensaje : 0}
        let columnas            = '';                           
        let columnasparaupdate  = '';        
        let uniones             = '';
        let campos              = '';


        objetoRespuesta.codigomensaje = 1;  
        objetoRespuesta.mensaje = 'Consulta Exitosa';

        let cabecera = await db.query(`SELECT * FROM core_plantilla_tm where idplantillatm = $1 order by orden asc`,[id]);

        let detalles = await db.query(`SELECT * FROM core_plantilla_tm_detalle where idcoreplantillatm = $1 order by idcoreplantillatmdetalle asc  `,[id])
                            .catch(console.log);
        
        //obtengo el nombre de la tabla maestra                    
        let tabla = cabecera.rows[0].descripcion;
        
        if(detalles.rows.length <= 0){
            objetoRespuesta.mensaje = 'No existe un detalle de plantilla configurado para la tabla maestra' + '['+tabla+']' ;   
            objetoRespuesta.codigomensaje = 3       
            cabecera.detalles   = [];
            cabecera.datosm     = [];
            objetoRespuesta.objeto = cabecera;
            return objetoRespuesta;
        }
        
        console.log('paso.........')
        
        for ( let item of detalles.rows ) {  
            let tablareferencia = '';          
            if(item.idtipocampo === 6){//si es lista
                 console.log('campo lista' , item.tablareferencia)  
                 
                 if(item.tablareferencia === null || item.tablareferencia === ''){
                    objetoRespuesta.mensaje =  'No se ha ingresado un nombre de tabla clave foranea para el campo', '['+item.nombrecampo+']' ;   
                    objetoRespuesta.codigomensaje = 2   
                 }
                 
                //buscar con el campo que tiene el nombre de la tabla foranea para traer los datos 
                tablareferencia = item.tablareferencia;
                try {
                    let lista = await db.query(`SELECT * FROM ${item.tablareferencia} `)
                            .catch(err => objetoRespuesta = this.mensajeError(err , 0 , null )); //err => this.mensajeError(err)   console.log
                    item.listaidtipocampo6 = lista.rows; 
                } catch (e) {
                    item.listaidtipocampo6 = [];
                    console.log({ name: e.name, message: e.message } , 'TREF' , item.tablareferencia );
                    //objetoRespuesta.mensaje =  'No existe la relacion de tabla clave foranea ', '['+tablareferencia+']' ;   
                    objetoRespuesta.codigomensaje = 2       
                     //throw new Error('No existe tabla ', '['+tablareferencia+']'  )                                 
                }
                            
            }
            //console.log('item',item);
            if(item.mostrarcrud){
                let  str = item.etiquetagrid.replace(/\s+/g, '_');
                //let nuevaStr = str.replace(" ", "-");
                //str.split(' ').join('_');
                //str.replace(/ /g, "_");
                //columnas = columnas + (item.nombrecampo+' '+item.etiquetagrid+',')
                //console.log('str',str)

                //validar los campos foraneos
                /* */
                if(item.idtipocampo === 6){               
                    //columnas = columnas + (tabla+'.'+item.nombrecampo+' '+item.tablareferencia+'.'+str+',')
                    //uniones  = uniones + ('inner join '+' '+ item.tablareferencia +' '+'on'+' '+item.tablareferencia+'.'+'id'+'=' + tabla+'.'+item.nombrecampo )
                    columnas = columnas + ( '(select%descripcion%from'+'%'+item.tablareferencia + '%' +'where%id='+  item.nombrecampo+')'+' '+str+',')
                }else{
                    columnas = columnas + (item.nombrecampo+' '+str+',')
                }
                
                //columnas = columnas + (item.nombrecampo+' '+str+',')
                columnasparaupdate = columnasparaupdate + (item.nombrecampo+',')
            }
            
        }             

        console.log('tabla de select ' , tabla)  
        //let datosm = await db.query(`SELECT * FROM ${tabla} where estado = 1`);
           
        //quito la ultima coma de los campos a usar en el select
        columnas = columnas.substring(0, columnas.length - 1);
        columnasparaupdate = columnasparaupdate.substring(0, columnasparaupdate.length - 1);

        console.log('columnas',columnas)
        //columnas = columnas.replace("_", " ");
        //reemplazo todos los % que use de comodin en el armado del select
        var re = /%/gi;        
        //columnas = columnas.replace("%", " ");
        let columnasnuevas = columnas.replace(re, " ");
        //console.log('columnas replace reemplazadas',columnas)
        console.log('columnasnuevas replace reemplazadas',columnasnuevas)

        //armar select con la tabla maestra y el core plantilladetalle   
        //cabecera.rows[0].query;
        //let datosm = await db.query(`SELECT ${columnas} ${cabecera.rows[0].query}`).catch(console.log);
        //let datosm = await db.query(`SELECT ${columnas} FROM ${tabla} ${uniones} where estado = 1`).catch(console.log);

        let datosm = [];
        let codigo_error_data_maestro = 0;
        cabecera.detalles = detalles.rows;
        cabecera.columnasparaupdate = columnasparaupdate;
        cabecera.tipoproceso = 1; // 1 insertar 0 actualiza
        objetoRespuesta.objeto = cabecera;

        try {
            datosm = await db.query(`SELECT ${columnasnuevas} FROM ${tabla} where estado = 1`).catch(err => objetoRespuesta = this.mensajeError(err , 1 , cabecera));
            //console.log('objetoRespuesta ',objetoRespuesta)
            if(objetoRespuesta.codigomensaje === 1){//si esta ok paso los datos
             console.log('datosm',datosm.rows)
             cabecera.datosm = datosm.rows;
            }
            codigo_error_data_maestro = 0;
        } catch (error) {
            console.log('error al cargar los datos del maestro =>' , tabla)
            cabecera.datosm = [];
        }
        
        //results.rows[0].dtm = datosm.rows;
        //cabecera.detalles = detalles.rows;
        //objetoRespuesta.objeto = cabecera;

        return objetoRespuesta;  //cabecera;
    }  


    mensajeError(error , codigo_error_data_maestro = 0 , cabecera ){
        let objetoRespuesta = {objeto: {} , mensaje : '' , codigomensaje : 0 , Error }
        //objetoRespuesta.mensaje =  'No existe la relacion de tabla clave foranea ', '['+tablareferencia+']' ;  
        
        if(codigo_error_data_maestro === 1){
            cabecera.datosm = [];
            console.log('datosm a cabecera ',cabecera.datosm)
            objetoRespuesta.objeto = cabecera;
        }
        
        objetoRespuesta.mensaje =  'Atencion ' + '['+error+']' ;   
        objetoRespuesta.codigomensaje = 2    
        objetoRespuesta.Error = new Error('Paso lo siguiente ',error)
        console.log('campo error' , error)     
       // throw new Error('Paso lo siguiente ',error)
        return objetoRespuesta;
    }


    /**
     * Para cargar todos los datos segun el id que seleccione el usuario
     */
    async getDatosTablaMaestraById(id , columnasupdateselect ,  tabla , idplantilla ) {


        let objetoRespuesta = {objeto: {} , mensaje : '' , codigomensaje : 0}
        let columnas            = '';                           
        let columnasparaupdate  = '';        
        let uniones             = '';
        let campos              = '';


        objetoRespuesta.codigomensaje = 1;  
        objetoRespuesta.mensaje = 'Consulta Exitosa';

        let cabecera = await db.query(`SELECT * FROM core_plantilla_tm where idplantillatm = $1 order by orden asc`,[idplantilla]);

        let detalles = await db.query(`SELECT * FROM core_plantilla_tm_detalle where idcoreplantillatm = $1 order by idcoreplantillatmdetalle asc  `,[idplantilla])
                            .catch(console.log);

        for ( let item of detalles.rows ) {  
            let tablareferencia = '';          
            if(item.idtipocampo === 6){//si es lista
                console.log('campo lista' , item.tablareferencia)  
                
                if(item.tablareferencia === null || item.tablareferencia === ''){
                    objetoRespuesta.mensaje =  'No se ha ingresado un nombre de tabla clave foranea para el campo', '['+item.nombrecampo+']' ;   
                    objetoRespuesta.codigomensaje = 2   
                }
                    
                //buscar con el campo que tiene el nombre de la tabla foranea para traer los datos 
                tablareferencia = item.tablareferencia;
                try {
                    let lista = await db.query(`SELECT * FROM ${item.tablareferencia} `)
                            .catch(err => objetoRespuesta = this.mensajeError(err , 0 , null )); //err => this.mensajeError(err)   console.log
                    item.listaidtipocampo6 = lista.rows; 
                } catch (e) {
                    item.listaidtipocampo6 = [];
                    console.log({ name: e.name, message: e.message } , 'TREF' , item.tablareferencia );
                    //objetoRespuesta.mensaje =  'No existe la relacion de tabla clave foranea ', '['+tablareferencia+']' ;   
                    objetoRespuesta.codigomensaje = 2       
                        //throw new Error('No existe tabla ', '['+tablareferencia+']'  )                                 
                }
                            
            }
        
            
        } 
                            


        let datosm = [];
     

        datosm = await db.query(`SELECT ${columnasupdateselect} FROM ${tabla} where id = $1 and estado = 1` ,[id]).catch(console.log);
        //console.log('datosm por ID ->' , datosm)

        //console.log('datosm .rows ->' , datosm.rows)
        //console.log(' Object.keys( (datosm.rows)[0])   ->' ,  Object.keys( (datosm.rows)[0]) )
        //console.log(' Object.values( (datosm.rows)[0])   ->' ,  Object.values( (datosm.rows)[0]) )
        //console.log(' Object.values( (datosm.rows)[0])[0]   ->' ,  Object.values( (datosm.rows)[0])[0] )
   

        //recorrer las columnas de la platilla y le agrego los valores de los campos que encontre con el id
        for ( let item of detalles.rows ) {  

            for (let index = 0; index < Object.keys( (datosm.rows)[0]).length; index++) {
                const element = Object.keys( (datosm.rows)[0])[index];                   
                    if(item.nombrecampo === element){                        
                        console.log('element ->' , element)
                         item.valordefecto = Object.values( (datosm.rows)[0])[index];
                         //break;
                    }                 
            }
  
        }


        /*
        try {
            datosm = await db.query(`SELECT ${columnasupdateselect} FROM ${tabla} where id = $1 and estado = 1` ,[id]).catch(err => objetoRespuesta = this.mensajeError(err , 1 , cabecera));
            //console.log('objetoRespuesta ',objetoRespuesta)
            if(objetoRespuesta.codigomensaje === 1){//si esta ok paso los datos
             console.log('datosm',datosm.rows)
             cabecera.datosm = datosm.rows;
            }
            codigo_error_data_maestro = 0;
        } catch (error) {
            console.log('error al cargar los datos del maestro =>' , error)
            cabecera.datosm = [];
        }*/

        return detalles;

    }


    async createOrUpdatePlantillaDetalle(data) {
        //console.log('GUARDAR' , data.tabladatos)
        try {
            let resul ;
            let columnas = ''; 
            let valores = '';     
            let sentencia = '';         

            if(data.estado === 0){
                console.log('GUARDAR' )
                for(let item of data.tabladatos){
             
                    // console.log('item'+item.nombrecampo)
                     if(item.nombrecampo != 'id'){
                         console.log('SIN ID '+item.nombrecampo)
                         if(item.idtipocampo == 3 && item.valordefecto == null){
                             valores  = valores  + ( item.valordefecto +',')
                         }
                         else if(item.idtipocampo == 3 && item.valordefecto == ''){
                             valores  = valores  + ( null +',')
                         }
                         else if(item.idtipocampo == 5 && (item.valordefecto == '' || item.valordefecto == null )){
                             valores  = valores  + ( false +',')
                         }
                         else if(item.valordefecto === 'now()'){
                             valores  = valores  + ( item.valordefecto +',')
                         }
                         else if(item.idtipocampo == 6 && item.valordefecto == ''){
                             valores  = valores  + ( null +',')
                         }
                         else  {
                             valores  = valores  + ("'"+item.valordefecto+"'"+',')
                         }
                         columnas = columnas + (item.nombrecampo+',')                    
                     }               
                 }
                 columnas = columnas.substring(0, columnas.length - 1);
                 valores  = valores.substring(0, valores.length - 1);
                 //console.log('columnas '+columnas)
                 //console.log('valores '+valores)            
                 resul = await db.query(`INSERT INTO ${data.tablanombre}(${columnas}) VALUES (${valores}) `)  
                 //resul = await db.query(`INSERT INTO tm_piscina (${columnas}) VALUES (${valores}) `)  

            }

            if(data.estado === 1){
                console.log('EDITAR' )
                 
                for(let item of data.tabladatos){
             
                    // console.log('item'+item.nombrecampo)

                    if(item.nombrecampo != 'id'){

                         if(item.idtipocampo == 3 && item.valordefecto == null){
                             //valores  = valores  + ( item.valordefecto +',')
                             sentencia = sentencia + ( item.nombrecampo + '=' + item.valordefecto +',' )
                         }
                         else if(item.idtipocampo == 3 && item.valordefecto == ''){
                             //valores  = valores  + ( null +',')
                             sentencia = sentencia + ( item.nombrecampo + '=' + null +',' )
                         }
                         else if(item.idtipocampo == 5 && (item.valordefecto == '' || item.valordefecto == null )){
                             //valores  = valores  + ( false +',')
                             sentencia = sentencia + ( item.nombrecampo + '=' + false +',' )
                         }
                         else if(item.valordefecto === 'now()'){
                             //valores  = valores  + ( item.valordefecto +',')
                             sentencia = sentencia + ( item.nombrecampo + '=' + item.valordefecto +',' )
                         }
                         else if(item.idtipocampo == 6 && item.valordefecto == ''){
                             //valores  = valores  + ( null +',')
                             sentencia = sentencia + ( item.nombrecampo + '=' + null +',' )
                         }
                         else  {
                             //valores  = valores  + ("'"+item.valordefecto+"'"+',')
                             sentencia = sentencia + ( item.nombrecampo + '=' + "'"+item.valordefecto+"'" +',' )
                         }
                        
                    }                     
                                    
                }
                  
                 sentencia  = sentencia.substring(0, sentencia.length - 1);
                  
                 //console.log('sentencia '+sentencia)     
                 //console.log('data.id '+data.id)            
                 //resul = await db.query(`INSERT INTO ${data.tablanombre}(${columnas}) VALUES (${valores}) `)  
                 resul = await db.query(`UPDATE ${data.tablanombre} SET ${sentencia} where id = ${data.id}  ` )  
            }
 
            return data;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }


    async createOrUpdatePlantillaTm(data) {
        try {
            let resul ;

            if (data.idplantillatm == 0) {
                resul = await db
                    .query("INSERT INTO core_plantilla_tm (nombretm , descripcion, estado) VALUES ($1, $2 , $3) RETURNING idplantillatm"
                     ,[data.nombre , data.descripcion, 1])                 
                data.idplantillatm = resul.rows[0].idplantillatm     
            }else{
                resul = await db
                    .query("UPDATE core_plantilla_tm set nombretm = $2 , descripcion = $3, estado = $4 where idgrupo = $1 "
                     ,[ data.idplantillatm , data.nombre , data.descripcion, data.estado])   

            }

            return data;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }

    async updatePlantillaTm(id , estado) {
        try {
            await db.query(`Update core_plantilla_tm set estado = $2 where idplantillatm = $1`, [id , estado])
            //.catch(console.log);  
            return id;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }           
    }

    async updateEstadoTablaMaestra(tablanombre , id, estado) {
        let objeto = {tablanombre: '' , estado: 0 , id: 0 }
        try {

            await db.query(`Update ${tablanombre} set estado = $2 where id = $1`, [id , estado])
            //.catch(console.log);  
            //objeto.tablanombre  = tablanombre;  
            let results = await db.query(`SELECT * FROM ${tablanombre} where id = $1` , [id ])
                .catch(console.log);
            return results.rows;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }           
    }



}

module.exports = corePlantilla;

