const db = require("../../config/db.js");
const params = require('../../configuracion.js');

class logisticaDespachosHielo{ 

    async getImpresionDocumentosbyIdAguajeAndFechaDespacho(idaguaje , fechadespacho){
        console.log('idaguaje->' , idaguaje , 'fechadespacho->' , fechadespacho)
        try {
            let detalle = await db.query(`
                select 
                    d.id, 
                    d.idcliente, cli.etiqueta cliente,
                    d.numeroguia, 
                    t.descripcion::text movil,
                    (ec.nombre || ' ' || ec.apellido) conductor,
                    d.cantidadsacos,
                    d.observaciones 
                from planificacion_despacho_hielos_detalle d
                inner join planificacion_despacho_hielos_cabecera c on d.iddespachohielo = c.id 
                left join tm_cliente cli on d.idcliente = cli.id 
                left join tm_empleado ec on d.idconductor = ec.id
                left join tm_transporte t on d.idtransporte = t.id 
                where c.idaguaje = $1 and c.fechadespacho = $2 and c.estado = 1 and d.estado = 1 
                order by d.iddespachohielo asc`,
                [idaguaje, fechadespacho])
            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }
    
    async createOrUpdateLogisticaDespachoHieloGuia(data) {
        try {
            let resul;

                // traer los parametros establecimiento , pto emision y secuencia actual ,
                // luego genero la secuencia 
                // despues llamar al servicio de guia desde el front y a este le paso la secuencia generada
                // si da un error la generacion de guia , debo devolver la secuencia original 
                let empresasecuencia = await db.query(`SELECT * FROM core_sociedad_secuencia where idsociedad = $1 and tipodocumento = '05' `, [data.idsociedad]);//despues enviar por parametro
                let secuenciagenerada = Number(empresasecuencia.rows[0].secuencia);
                await db.query(`UPDATE core_sociedad_secuencia set secuencia = $2 where idsociedad = $1 and tipodocumento = '05' `, [data.idsociedad , Number(secuenciagenerada + 1)]);
                //agrego los parametros adicionales al objeto recibido
                data.secuenciagenerada = Number(secuenciagenerada + 1);
                data.codigoEstablecimiento   = empresasecuencia.rows[0].establecimiento;
                data.codigoPuntoEmision      = empresasecuencia.rows[0].puntoemision;

                //logistica_despacho_guia inserto despues de generar la secuencia
                let numeroguia = data.codigoEstablecimiento + data.codigoPuntoEmision + data.secuenciagenerada;
                resul = await db
                .query(`INSERT INTO public.logistica_despacho_hielo_guia(
                        iddespachohielo, numeroguia, estado, generadosri,
                        estadosri, observacion, fechageneracionguia, idusuario, fecharegistro, contadorimpresion, cantidadremitida)
                        VALUES ($1, $2, 1, null, null, '', null, $3, now(), null, null) RETURNING id`,
                    [data.iddespachohielo,  numeroguia , data.idusuario ]) // .catch(console.log); SELECT SCOPE_IDENTITY() as id
                data.id = resul.rows[0].id; 
                
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }
    
    /**
     * Con este metodo anulo la guia generada: borro el idlogisticadespacho y el estado lo pongo en cero (0)
     * @param {*} data 
     * @returns 
     */
    async updateAnularLogisticaDespachoHieloGuia(data) {
        try {
            // logistica_despacho_guia -> ldg, ldg.id idlogisticadespachoguia cambiar a idldhg
            // logistica_despacho_hielo_guia -> ldhg
            await db.query(`UPDATE logistica_despacho_hielo_guia set iddespachohielo = null , estado = 0 where id = $1`, [data.idldhg]);
            //await db.query(`SELECT * FROM tablaguia where id = $1`, [iddocumento]);
            //devuelvo el registro con los datos actualizados
            //let results = await db.query(`SELECT * FROM logistica_despacho_guia where id = $1`, [data.id]);
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }
    
    async createLogisticaDespachoHieloEmpty(objeto){
        try {
            console.log('objeto recb->', objeto);
            await db.query('BEGIN');
        
            // 1. Check if the record exists
            const cabeceraResult = await db.query(
              `SELECT id FROM planificacion_despacho_hielos_cabecera 
               WHERE idaguaje = $1 AND fechadespacho = $2`,
              [objeto.idaguaje, objeto.fechadespacho]
            );
            // console.log(cabeceraResult);
        
            let idCabecera;
            if (cabeceraResult.rows.length > 0) {
              // If exists, get the ID
              idCabecera = cabeceraResult.rows[0].id;
            } else {
              // 2. If not, insert into cabecera
              const insertCabeceraResult = await db.query(
                `INSERT INTO planificacion_despacho_hielos_cabecera
                 (idaguaje, fechadespacho, fecharegistro, idusuario, estado)
                 VALUES ($1, $2, NOW(), $3, $4) RETURNING id`,
                [objeto.idaguaje, objeto.fechadespacho, objeto.idusuario, 1]
              );
              idCabecera = insertCabeceraResult.rows[0].id;
            }
        
            // 3. Insert into detalle
            await db.query(
              `INSERT INTO planificacion_despacho_hielos_detalle (iddespachohielo, estado) VALUES ($1, 1)`, 
              [ idCabecera]
            );
        
            // Commit transaction
            await db.query('COMMIT');
            // res.status(201).json({ message: 'Transaction successful', idCabecera });
            return objeto;
        } catch (error) {
            // Rollback transaction on error
            console.log(error)
            await db.query('ROLLBACK');
            // res.status(500).json({ message: 'Transaction failed', error: error.message });
            throw new Error(error);
        }
    }
    
    async getTransporte() {
        let results = await db.query(`SELECT * 
                                     FROM tm_transporte where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }

    // /**
    //  * Consulta los datos de un transporte
    //  * se envia el campo dinamicamente dentro del objeto
    //  * @param {*} objeto 
    //  * @returns 
    //  */
    // async getTransporte(objeto){
    //     console.log('objeto recb->', objeto);
    //     try {
    //         // await db.query(`UPDATE logistica_despacho SET ${objeto.campo}=$2 WHERE idlogisticadespacho=$1 `, 
    //         let registro = await db.query(`SELECT ${objeto.campo} FROM tm_transporte WHERE id=$1 `, 
    //             [ objeto.valor ])
    //         let dato = registro.rows[0];
    //         console.log('dato ->', dato);
    //         return dato;      
    //     } catch (error) {
    //         console.log(error)
    //         throw new Error(error)
    //     } 
    // }
    
    /**
     * Elimina un registro de detalle
     * @param {*} objeto 
     * @returns 
     */
    async deleteLogisticaDespachoHieloDetalle(objeto){
        console.log('objeto recb->', objeto);
        try {
            let registro = await db.query(`DELETE FROM planificacion_despacho_hielos_detalle where id=$1`, 
                [ objeto.id ])
            return objeto;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } 
    }
    
    /**
     * Elimina un registro de cabecera
     * @param {*} objeto 
     * @returns 
     */
    async deleteLogisticaDespachoHieloCabecera(objeto){
        try {
            console.log('objeto recb->', objeto);
            await db.query('BEGIN');

            await db.query(`DELETE FROM planificacion_despacho_hielos_detalle d
                            USING planificacion_despacho_hielos_cabecera c
                            WHERE d.iddespachohielo = c.id
                            AND c.idaguaje = $1
                            AND c.fechadespacho = $2`, 
            [objeto.idaguaje, objeto.fechadespacho])

            await db.query(`DELETE FROM planificacion_despacho_hielos_cabecera  
               WHERE idaguaje = $1 AND fechadespacho = $2`,
            [objeto.idaguaje, objeto.fechadespacho])
            
            // Commit transaction
            await db.query('COMMIT');
            return objeto;      
        } catch (error) {
            console.log(error)
            await db.query('ROLLBACK');
            throw new Error(error)
        } 
    }
    
    async updateLogisticaDespachoHieloDetalle(objeto){
        console.log('objeto recb->', objeto);
        try {
            await db.query(`UPDATE planificacion_despacho_hielos_detalle SET ${objeto.campo}=$2 WHERE id=$1 `, 
                [ objeto.id, objeto.valor ])
            console.log('objeto ->', objeto);
            return objeto;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } 
    }

}

module.exports = logisticaDespachosHielo;