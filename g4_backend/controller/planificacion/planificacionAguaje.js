const db = require("../../config/db");


class planificacionAguaje{

    //get all   
    async getAll() {
        let results = await db.query(`SELECT id, fecha_inicio::text, fecha_fin::text, anio::text, numeroaguaje::text, 
                                        descripcion, observacion, fecharegistro, idusuarioregistro, estado 
                                     FROM planificacion_aguaje where estado = 1 order by anio desc,numeroaguaje desc`)
                                     .catch(console.log);
        //console.log(results.rows);                 
        return results.rows;
    }

    async buscarAguajebyId(data){
        try {
            let resul = await db
                 .query("SELECT * FROM planificacion_aguaje where idaguaje = $1 ", [data.idaguaje ])                  
                 //data.idusuario = resul.rows[0].idusuario     
             return resul;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }
     
    async create(data) {

        try {
            let resul ;
            if (data.id == 0) {
                resul = await db
                .query(`INSERT INTO planificacion_aguaje ( anio, numeroaguaje, descripcion, observacion, fecharegistro,estado , fecha_inicio , fecha_fin) VALUES ( $1, $2, $3, $4, now(),1 , $5 , $6) RETURNING id`,
                    [data.anio,data.numeroaguaje,data.descripcion,data.observacion , data.fecha_inicio , data.fecha_fin]) // .catch(console.log);
                data.id = resul.rows[0].id;  
            }else{
                resul = await db
                    .query(`UPDATE planificacion_aguaje set fecha_inicio = $2 , fecha_fin = $3,
                             anio = $4 , numeroaguaje = $5 , descripcion = $6 , observacion = $7 , estado = $8 where id = $1 `
                       ,[ data.id , data.fecha_inicio , data.fecha_fin ,
                           data.anio , data.numeroaguaje, data.descripcion, data.observacion, data.estado])   
            }   
  
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }

}

module.exports = planificacionAguaje;