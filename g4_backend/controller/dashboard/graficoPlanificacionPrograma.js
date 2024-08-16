const db = require("../../config/db");


class graficoPlanificacionPrograma{

     
    async getAll() {
        let results = await db.query(`SELECT * 
                                     FROM planificacion_programa_cabecera where estado = 1 order by id asc`)
                                     .catch(console.log);
        return results.rows;
    }
	
	async getHielerasGrafico(idaguaje){
        try {
            let detalle = await db.query(`select pr.descripcion,  sum(ldm.cantidad) from planificacion_programa_cabecera 
			inner join planificacion_programa_detalle on planificacion_programa_cabecera.id=planificacion_programa_detalle.idprogramapesca
			inner join logistica_despacho ld on ld.idplanificaciondetalle=planificacion_programa_detalle.id
			inner join tm_proveedor pr on pr.id=ld.idproveedorhielo
            inner join logistica_despacho_materiales ldm  on ldm.idlogisticadespacho =ld.idlogisticadespacho 
			where planificacion_programa_cabecera.idaguaje=$1 and pr.idproveedortipo=2 and ldm.idproducto =2 and ld.estado=1
			group by pr.descripcion order by sum(ldm.cantidad*50)  desc `,[idaguaje ]);
			
			// where idproveedortipo=2

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }

	async getPuertosGrafico(idaguaje){
        try {
            let detalle = await db.query(`select count(idlogisticadespacho), tm_sucursal.descripcion 
			from logistica_despacho
			inner join tm_sucursal on logistica_despacho.idsucursal=tm_sucursal.id
            where logistica_despacho.estado=1
			group by tm_sucursal.descripcion order by  1 desc`);

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }
	
	async getClientesGrafico(idaguaje){
        try {
            let detalle = await db.query(`select tm_cliente.etiqueta, sum(cantidadprogramada) from planificacion_programa_cabecera 
			inner join planificacion_programa_detalle on planificacion_programa_cabecera.id=planificacion_programa_detalle.idprogramapesca
			inner join tm_cliente on planificacion_programa_cabecera.idcliente=tm_cliente.id
			where planificacion_programa_cabecera.idaguaje=$1 and planificacion_programa_detalle.estado=1
			group by tm_cliente.etiqueta order by 2 desc`,[idaguaje ]);

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }
	
	async getProveedorGrafico(idaguaje){
        try {
            let detalle = await db.query(`
            select sum(cant),tipopropiedad  from (
            select tm_campamento.nombre, tm_proveedor.idproveedorpropiedad, sum(cantidadprogramada) cant, 
			(case when tm_proveedor.idproveedorpropiedad=1 then tm_campamento.nombre else 'Terceros' end) as tipopropiedad
			from planificacion_programa_cabecera 
			inner join planificacion_programa_detalle on planificacion_programa_cabecera.id=planificacion_programa_detalle.idprogramapesca
			inner join tm_proveedor on planificacion_programa_cabecera.idproveedor=tm_proveedor.id
            inner join tm_campamento on tm_campamento.id=planificacion_programa_detalle.idcampamento
			where idproveedortipo=1 and planificacion_programa_cabecera.idaguaje=$1 and planificacion_programa_detalle.estado=1
			group by tm_campamento.nombre, tm_proveedor.idproveedorpropiedad  order by tipopropiedad) as t1
             group by tipopropiedad   `,[idaguaje ]);

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }
	
    async getEProgramabyIdAguaje(idaguaje){
        try {
            let detalle = await db.query(`select row_number() over (partition by a.idaguaje) id,  to_char(fechadespacho,'dd/mm/yyyy')fechadespacho,
            sum(b.cantidadprogramada) programadas,
			(select sum(coalesce (x.cantidadprogramada,0)) from logistica_despacho x 
            inner join planificacion_programa_detalle y on x.idplanificaciondetalle =y.id
            inner join planificacion_programa_cabecera z on z.id =y.idprogramapesca 
            where a.idaguaje =z.idaguaje and a.fechadespacho =z.fechadespacho  and x.estado=1)remitidas ,
            ROUND((
				(select sum(x.cantidadprogramada) from 
				 logistica_despacho x where x.idplanificaciondetalle=max(b.id))/sum(b.cantidadprogramada))::numeric*100::numeric,2)  efectividad,
			
			(select sum(x.cantidadprogramada) from planificacion_programa_detalle x 
			 inner join  planificacion_programa_cabecera y on x.idprogramapesca=y.id
			 where x.estado=1 and y.idaguaje=a.idaguaje  ) programadas_aguaje
            from
            planificacion_programa_cabecera a
            inner join planificacion_programa_detalle b 
            on a.id=b.idprogramapesca
            where a.idaguaje=$1 and b.estado=1
            group by a.idaguaje,a.fechadespacho order by 2 asc `,[idaguaje ])       

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }

    async getEProgramabyIdAguajeTabla(idaguaje){
        try {
            let detalle = await db.query(`select *,sum(bines_movilizados) over (partition by ida) tbines,sum(remitidas) over (partition by ida) tremitidas,round(((programadas/programadas_aguaje)::numeric*100),0) participacion
            from
            (
            select row_number() over (partition by a.idaguaje) id,  to_char(fechadespacho,'dd/mm/yyyy')fechadespacho,
                        sum(b.cantidadprogramada) programadas,
                        (select sum(coalesce (x.cantidadprogramada,0)) from logistica_despacho x 
                        inner join planificacion_programa_detalle y on x.idplanificaciondetalle =y.id
                        inner join planificacion_programa_cabecera z on z.id =y.idprogramapesca 
                        where a.idaguaje =z.idaguaje and a.fechadespacho =z.fechadespacho  and x.estado=1)remitidas ,
                        ROUND((
                            (select sum(coalesce (x.cantidadprogramada,0)) from logistica_despacho x 
                            inner join planificacion_programa_detalle y on x.idplanificaciondetalle =y.id
                            inner join planificacion_programa_cabecera z on z.id =y.idprogramapesca 
                            where a.idaguaje =z.idaguaje and a.fechadespacho =z.fechadespacho  and x.estado=1)/sum(b.cantidadprogramada))::numeric*100::numeric,2)  efectividad,
                        
                        (select sum(x.cantidadprogramada) from planificacion_programa_detalle x 
                         inner join  planificacion_programa_cabecera y on x.idprogramapesca=y.id
                         where x.estado=1 and y.idaguaje=a.idaguaje  ) programadas_aguaje,
                         (select sum(y.cantidad) from 
                         logistica_despacho x 
                         inner join logistica_despacho_materiales y on y.idlogisticadespacho=x.idlogisticadespacho	
                         inner join planificacion_programa_detalle yb on yb.id=x.idplanificaciondetalle
                         inner join planificacion_programa_cabecera xa on xa.id=yb.idprogramapesca
                          where a.idaguaje =xa.idaguaje and a.fechadespacho =xa.fechadespacho and y.idproducto=1 and x.estado=1 and yb.estado=1) bines_movilizados,
                          (select sum( y.cantidad) from 
                          logistica_despacho x 
                          inner join logistica_despacho_materiales y on y.idlogisticadespacho=x.idlogisticadespacho	
                          inner join planificacion_programa_detalle yb on yb.id=x.idplanificaciondetalle
                          inner join planificacion_programa_cabecera xa on xa.id=yb.idprogramapesca
                           where xa.idaguaje=a.idaguaje and y.idproducto=1 and yb.estado=1 and x.estado=1    ) bines_movilizados_aguaje,a.idaguaje ida
                        from
                        planificacion_programa_cabecera a
                        inner join planificacion_programa_detalle b 
                        on a.id=b.idprogramapesca
                        where a.idaguaje=$1 and b.estado=1 
                        group by a.idaguaje,a.fechadespacho order by a.idaguaje,a.fechadespacho 
            )
            as t1 `,[idaguaje ])       

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }

    async getProgramabyIdAguaje(idaguaje){
        try {
            let detalle = await db.query(`SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
                        d.idpiscina, pc.descripcion piscina,
                        d.cantidadprogramada, 
                        d.cantidadconfirmada, d.idviatransporte,
                        d.confirmada, d.fecharegistropesca, d.fechaconfirmacionpesca, d.fechamaterialescampo,
                        d.idusuarioprogramacion, d.idusuarioconfirmacion, d.cantidadtransporteterrestre, 
                        d.idtipotransporte, d.gramaje, d.cantidadtransportemaritimo, d.observacioncompras,
                        d.numeropuerta, d.idmetodocosecha, mc.descripcion metodocosecha, c.fechadespacho, d.tpe, d.estado, d.fechaarriboplanta,
                        c.idproveedor, p.descripcion proveedor,
                        c.idcliente, cli.etiqueta cliente, 
                        c.idcomprador, e.nombre ||' '|| e.apellido comprador,
                        c.idusuario, c.idtipoproceso , pt.descripcion tipoproceso,
                        c.estado estadocabecera
                        ,( SELECT   sum(d.cantidadconfirmada) librasaguaje 
                                FROM planificacion_programa_detalle d
                        inner join planificacion_programa_cabecera cc on cc.id = d.idprogramapesca
                        where cc.idaguaje = c.idaguaje) librasaguaje	 
                    FROM planificacion_programa_detalle d
                    inner join  planificacion_programa_cabecera c on c.id = d.idprogramapesca 
                    left join tm_proveedor p on p.id = c.idproveedor
                    left join tm_sector_pesca sp on sp.id = d.idsector 
                    left join tm_metodo_cosecha mc on mc.id = d.idmetodocosecha
                    left join tm_piscina pc on pc.id = d.idpiscina 
                    left join tm_cliente  cli on cli.id = c.idcliente
                    left join tm_empleado  e on e.id = c.idcomprador
                    inner join tm_proceso_tipo pt on pt.id = c.idtipoproceso
                    inner join tm_proveedor_propiedad pp on pp.id = c.idproveedorpropiedad
                    left join tm_campamento camp on camp.id = d.idcampamento
                    where c.idaguaje = $1  and c.estado = 1 and d.estado = 1 order by d.id asc`,[idaguaje ])       

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }


    async getProgramabyIdAguajeAndIdCliente(idaguaje, idcliente){
        try {
            let cabecera = await db
                 .query(`SELECT c.id, c.fechadespacho, c.idaguaje, pa.descripcion ||' '|| pa.numeroaguaje aguaje,
                            c.idproveedor, p.descripcion proveedor,
                            c.idcomprador, e.nombre ||' '|| e.apellido comprador,
                            c.fecharegistro, c.idusuario, 
                            c.estado, c.idtipoproceso , pt.descripcion tipoproceso,
                            c.idproveedorpropiedad , pp.descripcion proveedorpropiedad,
                            c.idcliente , cli.descripcion cliente 
                            ,(	SELECT   sum(d.cantidadconfirmada) librasaguaje 
                            FROM planificacion_programa_detalle d
                        inner join planificacion_programa_cabecera cc on cc.id = d.idprogramapesca
                        where cc.idaguaje = c.idaguaje) librasaguaje	 
                        FROM public.planificacion_programa_cabecera c 
                            inner join tm_proveedor p on p.id = c.idproveedor
                            left join tm_empleado  e on e.id = c.idcomprador
                            left join tm_cliente  cli on cli.id = c.idcliente
                            inner join tm_proceso_tipo pt on pt.id = c.idtipoproceso
                            inner join planificacion_aguaje pa on pa.id = c.idaguaje
                            inner join tm_proveedor_propiedad pp on pp.id = c.idproveedorpropiedad
                         WHERE c.idaguaje = $1 and c.idcliente = $2 `, [ idaguaje , idcliente ])                  
                 //data.idusuario = results.rows[0].idusuario     

               if(cabecera.rows.length > 0){
                    let detalle = await db.query(`SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, d.idpiscina, pc.descripcion piscina,
                                                    d.cantidadprogramada, d.idcliente, d.cantidadconfirmada, d.idviatransporte,
                                                    d.confirmada, d.fecharegistropesca, d.fechaconfirmacionpesca, d.fechamaterialescampo,
                                                    d.idusuarioprogramacion, d.idusuarioconfirmacion, d.cantidadtransporteterrestre, 
                                                    d.idtipotransporte, d.gramaje, d.cantidadtransportemaritimo, d.observacioncompras,
                                                    d.numeropuerta, d.idmetodocosecha, mc.descripcion metodocosecha, c.fechadespacho, d.tpe, d.estado, d.fechaarriboplanta,
                                                    c.idproveedor, p.descripcion proveedor 
                                                FROM planificacion_programa_detalle d
                                                inner join planificacion_programa_cabecera c on c.id = d.idprogramapesca 
                                                left join tm_proveedor p on p.id = c.idproveedor
                                                left join tm_sector_pesca sp on sp.id = d.idsector 
                                                left join tm_metodo_cosecha mc on mc.id = d.idmetodocosecha
                                                left join tm_piscina pc on pc.id = d.idpiscina 
                                                where d.idprogramapesca = $1 and d.estado = 1 order by d.id asc`, [cabecera.rows[0].id])       
                 //console.log('detalle' , detalle.rows);                             
                  cabecera.rows[0].detalle = detalle.rows;
               }else{
                if(cabecera.rows.length > 0){
                    cabecera.rows[0].detalle = [];
                }
               }  
 
             return cabecera.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }


    async getProgramabyIdAguajeAndIdClienteV2(idaguaje, idcliente){
        try {
            let detalle = await db.query(`SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento,camp.descripcion campamento,
                                    d.idpiscina, pc.descripcion piscina,
                                    d.cantidadprogramada, 
                                    d.cantidadconfirmada, d.idviatransporte,
                                    d.confirmada, d.fecharegistropesca, d.fechaconfirmacionpesca, d.fechamaterialescampo,
                                    d.idusuarioprogramacion, d.idusuarioconfirmacion, d.cantidadtransporteterrestre, 
                                    d.idtipotransporte, d.gramaje, d.cantidadtransportemaritimo, d.observacioncompras,
                                    d.numeropuerta, d.idmetodocosecha, mc.descripcion metodocosecha, c.fechadespacho, d.tpe, d.estado, d.fechaarriboplanta,
                                    c.idproveedor, p.descripcion proveedor,
                                    c.idcliente, cli.etiqueta cliente, 
                                    c.idcomprador, e.nombre ||' '|| e.apellido comprador,
                                    c.idusuario, c.idtipoproceso , pt.descripcion tipoproceso,
                                    c.estado estadocabecera
                                    ,( SELECT   sum(d.cantidadconfirmada) librasaguaje 
                                            FROM planificacion_programa_detalle d
                                       inner join planificacion_programa_cabecera cc on cc.id = d.idprogramapesca
                                       where cc.idaguaje = c.idaguaje) librasaguaje	 
                                FROM planificacion_programa_detalle d
                                inner join planificacion_programa_cabecera c on c.id = d.idprogramapesca 
                                left join tm_proveedor p on p.id = c.idproveedor
                                left join tm_sector_pesca sp on sp.id = d.idsector 
                                left join tm_metodo_cosecha mc on mc.id = d.idmetodocosecha
                                left join tm_piscina pc on pc.id = d.idpiscina 
                                left join tm_cliente  cli on cli.id = c.idcliente
                                left join tm_empleado  e on e.id = c.idcomprador
                                inner join tm_proceso_tipo pt on pt.id = c.idtipoproceso
                                inner join tm_proveedor_propiedad pp on pp.id = c.idproveedorpropiedad
                                left join tm_campamento camp on camp.id = d.idcampamento
                                where c.idaguaje = $1 and c.idcliente = $2 and c.estado = 1 and d.estado = 1 order by d.id asc`,[idaguaje , idcliente])       
 
             return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }


    async getProgramaDetalleLogisticabyIdAguaje(idaguaje){
        try {
            let cabecera = await db
                 .query(`SELECT c.id, c.fechadespacho, c.idaguaje, pa.descripcion ||' '|| pa.numeroaguaje aguaje,
                            c.idproveedor, p.descripcion proveedor,
                            c.idcomprador, e.nombre ||' '|| e.apellido comprador,
                            c.fecharegistro, c.idusuario, 
                            c.estado, c.idtipoproceso , pt.descripcion tipoproceso,
                            c.idproveedorpropiedad , pp.descripcion proveedorpropiedad,
                            c.idcliente , cli.descripcion cliente	 
                        FROM public.planificacion_programa_cabecera c 
                            inner join tm_proveedor p on p.id = c.idproveedor
                            left join tm_empleado  e on e.id = c.idcomprador
                            left join tm_cliente  cli on cli.id = c.idcliente
                            inner join tm_proceso_tipo pt on pt.id = c.idtipoproceso
                            inner join planificacion_aguaje pa on pa.id = c.idaguaje
                            inner join tm_proveedor_propiedad pp on pp.id = c.idproveedorpropiedad
                         WHERE c.idaguaje = $1 `, [ idaguaje ])  
      
            if(cabecera.rows.length > 0){
                let detalle  = await db
                 .query(`SELECT  d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, d.idpiscina, pc.descripcion piscina,
                                d.cantidadprogramada, c.idcliente, cli.descripcion cliente,
                                c.idproveedor, p.descripcion proveedor,
                                c.idtipoproceso , pt.descripcion tipoproceso,
                                d.cantidadconfirmada, d.idviatransporte,
                                d.confirmada, d.fecharegistropesca, d.fechaconfirmacionpesca, d.fechamaterialescampo,
                                d.idusuarioprogramacion, d.idusuarioconfirmacion, d.cantidadtransporteterrestre, 
                                d.idtipotransporte, d.gramaje, d.cantidadtransportemaritimo, d.observacioncompras,
                                d.numeropuerta, d.idmetodocosecha, mc.descripcion metodocosecha, c.fechadespacho, d.tpe, d.estado, d.fechaarriboplanta		
                        FROM planificacion_programa_detalle d
                        inner join planificacion_programa_cabecera c on c.id = d.idprogramapesca 
                        left join tm_proveedor p on p.id = c.idproveedor
                        left join tm_sector_pesca sp on sp.id = d.idsector 
                        left join tm_metodo_cosecha mc on mc.id = d.idmetodocosecha
                        left join tm_piscina pc on pc.id = d.idpiscina 
                        left join tm_cliente cli on cli.id = c.idcliente
                        inner join tm_proceso_tipo pt on pt.id = c.idtipoproceso
                        inner join planificacion_aguaje a on a.id = c.idaguaje
                        where a.id = $1 order by d.id asc`, [ idaguaje ])                  
                 //data.idusuario = results.rows[0].idusuario  
                 cabecera.rows[0].detalle = detalle.rows;
            }else{
                if(cabecera.rows.length > 0){
                    cabecera.rows[0].detalle = [];
                }
            }      
            return cabecera.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }

    
     


    async getTipoProceso() {
        let results = await db.query(`SELECT * 
                                     FROM tm_proceso_tipo where estado = 1 order by ordenadopor asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getProveedor() {
        let results = await db.query(`SELECT * 
                                     FROM tm_proveedor where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getProveedorCamaron() {
        let results = await db.query(`SELECT * 
                                     FROM tm_proveedor where estado = 1 and idproveedortipo = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getProveedorCamaronByIdpropiedad(idproveedorpropiedad) {
        let results = await db.query(`SELECT * 
                                     FROM tm_proveedor where estado = 1 and idproveedortipo = 1 and idproveedorpropiedad = $1
                                       order by descripcion asc` , [idproveedorpropiedad])
                                     .catch(console.log);
        return results.rows;
    }

    async getProveedorPropiedad() {
        let results = await db.query(`SELECT * 
                                     FROM tm_proveedor_propiedad where estado = 1 order by id asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getProveedorByIdPropiedad(idproveedorpropiedad) {
        let results = await db.query(`SELECT * 
                                     FROM tm_proveedor where estado = 1 and idproveedorpropiedad = $1 
                                      order by descripcion asc`,[idproveedorpropiedad])
                                     .catch(console.log);
        return results.rows;
    }

    async getComprador() {
        let results = await db.query(`SELECT * 
                                     FROM tm_empleado where estado = 1 and idcargoempleado = 1 order by apellido asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getSector() {
        let results = await db.query(`SELECT * 
                                     FROM tm_sector_pesca where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getCampamento() {
        let results = await db.query(`SELECT * 
                                     FROM tm_campamento where estado = 1 order by nombre asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getMetodoCosecha() {
        let results = await db.query(`SELECT * 
                                     FROM tm_metodo_cosecha where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getPiscina() {
        let results = await db.query(`SELECT * 
                                     FROM tm_piscina where estado = 1 order by length(descripcion) asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getClientes() {
        let results = await db.query(`SELECT * 
                                     FROM tm_cliente where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }


    async getAllMaster() {
        let data = null;
        let clientes = await db.query(`SELECT * 
                                     FROM tm_cliente where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        let piscinas = await db.query(`SELECT * 
                                     FROM tm_piscina where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        let metodocosechas = await db.query(`SELECT * 
                                     FROM tm_metodo_cosecha where estado = 1 order by descripcion asc`)
                                     .catch(console.log);      
        let campamentos = await db.query(`SELECT * 
                                     FROM tm_campamento where estado = 1 order by nombre asc`)
                                     .catch(console.log);                             
        data.campamentos    =   campamentos.rows;
        data.metodocosechas =   metodocosechas.rows;
        data.clientes       =   clientes.rows;   
        data.piscinas       =   piscinas.rows;       
        return data;
    }


    /**
     * Actualizacion de item 
     * se envia el campo dinamicamente dentro del objeto
     * @param {*} objeto 
     * @returns 
     */
    async updatePlanificacionProgramaDetalle(objeto){
        //console.log('objeto recb->', objeto);
        try {
            await db.query(`UPDATE planificacion_programa_detalle SET ${objeto.campo}=$2 WHERE id=$1 `, 
                [ objeto.id ,  objeto.valor ])
            return objeto;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } 
    }


    /**
     * Metodo para actualizar algun campo de la cabecera
     * Ejemplo : Consultar con el idprogramapesca la cabecera y reemplazar el id del proveedor
     * @param {*} objeto 
     * @returns 
     */
    async updatePlanificacionProgramaCabecera(objeto){
        //console.log('objeto recb->', objeto);
        try {
            //se busca si existe alguna cabecera con los parametros establecidos
            let data = await db.query(`SELECT c.* 
                                        FROM planificacion_programa_cabecera c
                                        where c.idaguaje = $1 and c.idcliente = $2 
                                        and c.fechadespacho = $3 and c.idproveedor = $4 
                                        and c.idtipoproceso = $5 and c.estado = 1 `,
                                [objeto.idaguaje, objeto.idcliente , objeto.fechadespacho , objeto.idproveedor , objeto.idtipoproceso]);
            
            if(data.rows.length > 0){
                console.log('EXISTE CABECERA AL BUSCAR EDICION......................................................')
                //tomar el id de la cabecera y actualizarlo en el detalle 
                await db.query(`UPDATE planificacion_programa_detalle SET idprogramapesca=$2 WHERE id=$1 `, 
                    [ objeto.id ,  data.rows[0].id ]);
            }else{
                console.log('CREAR CABECERA EN EDICION......................................................')
                let cabecera = await db
                    .query(`INSERT INTO planificacion_programa_cabecera(
                            fechadespacho, idproveedor, idcomprador, fecharegistro, idusuario, estado,
                            idtipoproceso, idaguaje , idproveedorpropiedad , quimico , idcliente)
                            VALUES ($1, $2, $3, now(), $4, $5, $6, $7 , $8 ,$9 , $10) RETURNING id`,
                        [objeto.fechadespacho,objeto.idproveedor, objeto.idcomprador ,objeto.idusuario ,
                            1 , objeto.idtipoproceso , objeto.idaguaje , objeto.idproveedorpropiedad ,
                            objeto.quimico , objeto.idcliente]);
                //con la cebecera generada actualizo en el detalle 
                await db.query(`UPDATE planificacion_programa_detalle SET idprogramapesca=$2 WHERE id=$1 `, 
                [ objeto.id ,  cabecera.rows[0].id ]);

            }
           
            return objeto;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } 
    }

     
    async createOrUpdate(data) {
        try {
            //console.log('data idtipoproceso ......................................................' , data.idtipoproceso)
            let resul ;
            if (data.id === 0) {
                //console.log('INSERTARRRRRRRRRR......................................................')
                resul = await db
                    .query(`INSERT INTO planificacion_programa_cabecera(
                            fechadespacho, idproveedor, idcomprador, fecharegistro, idusuario, estado,
                            idtipoproceso, idaguaje , idproveedorpropiedad , quimico , idcliente)
                            VALUES ($1, $2, $3, now(), $4, $5, $6, $7 , $8 ,$9 , $10) RETURNING id`,
                        [data.fechadespacho,data.idproveedor,data.idcomprador,data.idusuario ,
                             data.estado , data.idtipoproceso , data.idaguaje , data.idproveedorpropiedad ,data.quimico , data.idcliente]) // .catch(console.log); SELECT SCOPE_IDENTITY() as id
                data.id = resul.rows[0].id;  
                if(data.objetodetalle){
                    console.log('INSERTARRRRRRRRRR. DETALLLE.....................................................')
                    let det = await db.query(`INSERT INTO planificacion_programa_detalle(idprogramapesca, idsector, idcampamento, idpiscina,
                        cantidadprogramada, idcliente, cantidadconfirmada,
                        idviatransporte, confirmada, fecharegistropesca, fechaconfirmacionpesca, fechamaterialescampo,
                        idusuarioprogramacion, idusuarioconfirmacion, cantidadtransporteterrestre, idtipotransporte,
                        gramaje, cantidadtransportemaritimo, observacioncompras, numeropuerta, idmetodocosecha,
                        tpe, estado, fechaarriboplanta)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now() , $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22 ,$23  ) RETURNING id`,
                         [data.id, data.objetodetalle.idsector, data.objetodetalle.idcampamento ,data.objetodetalle.idpiscina, data.objetodetalle.cantidadprogramada, data.objetodetalle.idcliente, 
                            data.objetodetalle.cantidadconfirmada, data.objetodetalle.idviatransporte, data.objetodetalle.confirmada, data.objetodetalle.fechaconfirmacionpesca, data.objetodetalle.fechamaterialescampo, 
                            data.objetodetalle.idusuarioprogramacion, data.objetodetalle.idusuarioconfirmacion , data.objetodetalle.cantidadtransporteterrestre , data.objetodetalle.idtipotransporte,
                            data.objetodetalle.gramaje , data.objetodetalle.cantidadtransportemaritimo , data.objetodetalle.observacioncompras , data.objetodetalle.numeropuerta , data.objetodetalle.idmetodocosecha,
                            data.objetodetalle.tpe , data.objetodetalle.estado , data.objetodetalle.fechaarriboplanta ])
                    data.objetodetalle.id = data.id
                }            

 
            }else{
                //console.log('EDDDDIIIIIIIIIIIITARRRRRRRRRR......................................................')
                resul = await db
                    .query(`UPDATE planificacion_programa_cabecera set fechadespacho = $2 , idproveedor = $3,
                            idcomprador = $4 , estado = $5 , idtipoproceso = $6 , idaguaje = $7 ,
                            idproveedorpropiedad = $8 , quimico = $9 , idcliente = $10  where id = $1 `
                            ,[ data.id , data.fechadespacho , data.idproveedor ,
                                data.idcomprador , data.estado, data.idtipoproceso, data.idaguaje ,
                                 data.idproveedorpropiedad ,data.quimico , data.idcliente]);
                 if(data.objetodetalle){
                    console.log('INSERTARRRRRRRRRR. DETALLLE CAB EXISTENTE...........................................')
                    let det = await db.query(`INSERT INTO planificacion_programa_detalle(idprogramapesca, idsector, idcampamento, idpiscina,
                        cantidadprogramada, idcliente, cantidadconfirmada,
                        idviatransporte, confirmada, fecharegistropesca, fechaconfirmacionpesca, fechamaterialescampo,
                        idusuarioprogramacion, idusuarioconfirmacion, cantidadtransporteterrestre, idtipotransporte,
                        gramaje, cantidadtransportemaritimo, observacioncompras, numeropuerta, idmetodocosecha,
                        tpe, estado, fechaarriboplanta)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now() , $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22 ,$23  ) RETURNING id`,
                         [data.id, data.objetodetalle.idsector, data.objetodetalle.idcampamento ,data.objetodetalle.idpiscina, data.objetodetalle.cantidadprogramada, data.objetodetalle.idcliente, 
                            data.objetodetalle.cantidadconfirmada, data.objetodetalle.idviatransporte, data.objetodetalle.confirmada, data.objetodetalle.fechaconfirmacionpesca, data.objetodetalle.fechamaterialescampo, 
                            data.objetodetalle.idusuarioprogramacion, data.objetodetalle.idusuarioconfirmacion , data.objetodetalle.cantidadtransporteterrestre , data.objetodetalle.idtipotransporte,
                            data.objetodetalle.gramaje , data.objetodetalle.cantidadtransportemaritimo , data.objetodetalle.observacioncompras , data.objetodetalle.numeropuerta , data.objetodetalle.idmetodocosecha,
                            data.objetodetalle.tpe , data.objetodetalle.estado , data.objetodetalle.fechaarriboplanta ])
                    data.objetodetalle.id = data.id
                }                     
            }   
  
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }


    async createOrUpdateV2(data) {
        try {
            //console.log('data idtipoproceso ......................................................' , data.idtipoproceso)
            let resul ;
            let cabeceraexistente;

            //consultar si existe alguna cabecera creada para los parametros : idaguaje , idcliente , fechadespacho , idproveedor , idtipoproceso
            cabeceraexistente = await db.query(`SELECT c.* 
                                                FROM planificacion_programa_cabecera c
                                                where c.idaguaje = $1 and c.idcliente = $2 
                                                and c.fechadespacho = $3 and c.idproveedor = $4 
                                                and c.idtipoproceso = $5 and c.estado = 1 `, [data.idaguaje, data.idcliente , data.fechadespacho , data.idproveedor , data.idtipoproceso]);
            
            if(cabeceraexistente.rows.length > 0){
                console.log('EXISTE CABECERA......................................................')
                //con los datos existente de cabecera crear los items nuevos de la lista del detalle 

                if(data.objetodetalle){
                    console.log('INSERTARRRRRRRRRR. DETALLLE --- EXIST CAB.....................................................')
                    let det = await db.query(`INSERT INTO planificacion_programa_detalle(idprogramapesca, idsector, idcampamento, idpiscina,
                        cantidadprogramada, idcliente, cantidadconfirmada,
                        idviatransporte, confirmada, fecharegistropesca, fechaconfirmacionpesca, fechamaterialescampo,
                        idusuarioprogramacion, idusuarioconfirmacion, cantidadtransporteterrestre, idtipotransporte,
                        gramaje, cantidadtransportemaritimo, observacioncompras, numeropuerta, idmetodocosecha,
                        tpe, estado, fechaarriboplanta)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now() , $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22 ,$23  ) RETURNING id`,
                         [cabeceraexistente.rows[0].id, data.objetodetalle.idsector, data.objetodetalle.idcampamento ,data.objetodetalle.idpiscina, data.objetodetalle.cantidadprogramada, data.objetodetalle.idcliente, 
                            data.objetodetalle.cantidadconfirmada, data.objetodetalle.idviatransporte, data.objetodetalle.confirmada, data.objetodetalle.fechaconfirmacionpesca, data.objetodetalle.fechamaterialescampo, 
                            data.objetodetalle.idusuarioprogramacion, data.objetodetalle.idusuarioconfirmacion , data.objetodetalle.cantidadtransporteterrestre , data.objetodetalle.idtipotransporte,
                            data.objetodetalle.gramaje , data.objetodetalle.cantidadtransportemaritimo , data.objetodetalle.observacioncompras , data.objetodetalle.numeropuerta , data.objetodetalle.idmetodocosecha,
                            data.objetodetalle.tpe , data.objetodetalle.estado , data.objetodetalle.fechaarriboplanta ])
                    data.objetodetalle.id = data.id
                }   

            }else{
                console.log('CREAR CABECERA......................................................')
                //crearla 
                resul = await db
                    .query(`INSERT INTO planificacion_programa_cabecera(
                            fechadespacho, idproveedor, idcomprador, fecharegistro, idusuario, estado,
                            idtipoproceso, idaguaje , idproveedorpropiedad , quimico , idcliente)
                            VALUES ($1, $2, $3, now(), $4, $5, $6, $7 , $8 ,$9 , $10) RETURNING id`,
                        [data.fechadespacho,data.idproveedor,data.idcomprador,data.idusuario ,
                            data.estado , data.idtipoproceso , data.idaguaje , data.idproveedorpropiedad ,data.quimico , data.idcliente]) // .catch(console.log); SELECT SCOPE_IDENTITY() as id
                data.id = resul.rows[0].id;  
                if(data.objetodetalle){
                    console.log('INSERTARRRRRRRRRR. DETALLLE --- CREA CAB.....................................................')
                    let det = await db.query(`INSERT INTO planificacion_programa_detalle(idprogramapesca, idsector, idcampamento, idpiscina,
                        cantidadprogramada, idcliente, cantidadconfirmada,
                        idviatransporte, confirmada, fecharegistropesca, fechaconfirmacionpesca, fechamaterialescampo,
                        idusuarioprogramacion, idusuarioconfirmacion, cantidadtransporteterrestre, idtipotransporte,
                        gramaje, cantidadtransportemaritimo, observacioncompras, numeropuerta, idmetodocosecha,
                        tpe, estado, fechaarriboplanta)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now() , $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22 ,$23  ) RETURNING id`,
                        [data.id, data.objetodetalle.idsector, data.objetodetalle.idcampamento ,data.objetodetalle.idpiscina, data.objetodetalle.cantidadprogramada, data.objetodetalle.idcliente, 
                            data.objetodetalle.cantidadconfirmada, data.objetodetalle.idviatransporte, data.objetodetalle.confirmada, data.objetodetalle.fechaconfirmacionpesca, data.objetodetalle.fechamaterialescampo, 
                            data.objetodetalle.idusuarioprogramacion, data.objetodetalle.idusuarioconfirmacion , data.objetodetalle.cantidadtransporteterrestre , data.objetodetalle.idtipotransporte,
                            data.objetodetalle.gramaje , data.objetodetalle.cantidadtransportemaritimo , data.objetodetalle.observacioncompras , data.objetodetalle.numeropuerta , data.objetodetalle.idmetodocosecha,
                            data.objetodetalle.tpe , data.objetodetalle.estado , data.objetodetalle.fechaarriboplanta ])
                    data.objetodetalle.id = data.id
                }            

            }                                    
  
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }


    async getPlanificacionprogramaByIdAguaje(idaguaje){
        let results = await db.query(`SELECT * FROM ft_planificacionprograma($1)`,[idaguaje]).catch(console.log);
        console.log('results.rows' , results.rows)
        console.log('idaguaje' , idaguaje)
        return results.rows;
    }


}

module.exports = graficoPlanificacionPrograma;