const db = require("../../config/db");
const params = require('../../configuracion.js');

class logisticaDespachos{ 



    async getProgramaDetalleLogisticabyIdAguaje(idaguaje){
        console.log('idaguaje->' , idaguaje)
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
                    where c.idaguaje = $1  and c.estado = 1 and d.estado = 1 order by d.id asc`,[idaguaje ])       

                    let totalcabeceralibrasprogramadas = 0;//lo tomo del detalle principal
                    let totalcabecerabines  = 0;
                    let totalcabeceraconica = 0;
                    let totalcabeceracalada = 0;
                    let totalcabecerahielo  = 0;
                    let totalcabecerameta   = 0;
                    let totalcabecerasal    = 0;
                    let totalcabeceralibrasprogramadasmovil = 0;


                    for (let item of detalle.rows) {
                        item.detallemoviles = await this.getInformacionMovilesbyIdPlanificacionDetalle(item.id); 
                        let totalbines  = 0;
                        let totalconica = 0;
                        let totalcalada = 0;
                        let totalhielo  = 0;
                        let totalmeta   = 0;
                        let totalsal    = 0;
                        let totalcantidadprogramada  = 0;
                        for (let itemaux of item.detallemoviles) {
                            totalbines += itemaux.bines;
                            totalconica += Number(itemaux.conica);
                            totalcalada += itemaux.calada;
                            totalhielo  += itemaux.hielo;
                            totalmeta   += itemaux.meta;
                            totalsal    += itemaux.sal;
                            totalcantidadprogramada += itemaux.cantidadprogramada
                        }
                        item.totalbines = totalbines;
                        item.totalconica = totalconica;
                        item.totalcalada = totalcalada;
                        item.totalhielo  = totalhielo;
                        item.totalmeta   = totalmeta;
                        item.totalsal    = totalsal;
                        item.totalcantidadprogramada = totalcantidadprogramada;
                        //console.log('totalbines'+totalbines)
                        //console.log('item.totalbines'+item.totalbines)
                        totalcabeceralibrasprogramadas += item.cantidadprogramada;
                        totalcabeceralibrasprogramadasmovil += item.totalcantidadprogramada;
                        totalcabecerabines  += totalbines;
                        totalcabeceraconica += totalconica;
                        totalcabeceracalada += totalcalada;
                        totalcabecerahielo  += totalhielo;
                        totalcabecerameta   += totalmeta;
                        totalcabecerasal    += totalsal;

                    }

                    for (let item of detalle.rows) {
                        item.totalcabeceralibrasprogramadas = totalcabeceralibrasprogramadas;
                        item.totalcabeceralibrasprogramadasmovil  = totalcabeceralibrasprogramadasmovil;
                        item.totalcabecerabines  = totalcabecerabines;
                        item.totalcabeceraconica = totalcabeceraconica;
                        item.totalcabeceracalada = totalcabeceracalada;
                        item.totalcabecerahielo  = totalcabecerahielo;
                        item.totalcabecerameta   = totalcabecerameta;
                        item.totalcabecerasal    = totalcabecerasal;

                    }

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }


    async getProgramaDetalleLogisticabyIdAguajeAndFechaDespacho(idaguaje , fechadespacho){
        console.log('idaguaje->' , idaguaje , 'fechadespacho->' , fechadespacho)
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
                    where c.idaguaje = $1 and c.fechadespacho = $2 and c.estado = 1 and d.estado = 1 order by d.id asc`,[idaguaje , fechadespacho ])       

                    let totalcabeceralibrasprogramadas = 0;//lo tomo del detalle principal
                    let totalcabecerabines  = 0;
                    let totalcabeceraconica = 0;
                    let totalcabeceracalada = 0;
                    let totalcabecerahielo  = 0;
                    let totalcabecerameta   = 0;
                    let totalcabecerasal    = 0;
                    let totalcabeceralibrasprogramadasmovil = 0;


                    for (let item of detalle.rows) {
                        item.detallemoviles = await this.getInformacionMovilesbyIdPlanificacionDetalle(item.id); 
                        let totalbines  = 0;
                        let totalconica = 0;
                        let totalcalada = 0;
                        let totalhielo  = 0;
                        let totalmeta   = 0;
                        let totalsal    = 0;
                        let totalcantidadprogramada  = 0;
                        for (let itemaux of item.detallemoviles) {
                            totalbines += itemaux.bines;
                            totalconica += Number(itemaux.conica);
                            totalcalada += itemaux.calada;
                            totalhielo  += itemaux.hielo;
                            totalmeta   += itemaux.meta;
                            totalsal    += itemaux.sal;
                            totalcantidadprogramada += itemaux.cantidadprogramada
                        }
                        item.totalbines = totalbines;
                        item.totalconica = totalconica;
                        item.totalcalada = totalcalada;
                        item.totalhielo  = totalhielo;
                        item.totalmeta   = totalmeta;
                        item.totalsal    = totalsal;
                        item.totalcantidadprogramada = totalcantidadprogramada;
                        //console.log('totalbines'+totalbines)
                        //console.log('item.totalbines'+item.totalbines)
                        totalcabeceralibrasprogramadas += item.cantidadprogramada;
                        totalcabeceralibrasprogramadasmovil += item.totalcantidadprogramada;
                        totalcabecerabines  += totalbines;
                        totalcabeceraconica += totalconica;
                        totalcabeceracalada += totalcalada;
                        totalcabecerahielo  += totalhielo;
                        totalcabecerameta   += totalmeta;
                        totalcabecerasal    += totalsal;

                    }

                    for (let item of detalle.rows) {
                        item.totalcabeceralibrasprogramadas = totalcabeceralibrasprogramadas;
                        item.totalcabeceralibrasprogramadasmovil  = totalcabeceralibrasprogramadasmovil;
                        item.totalcabecerabines  = totalcabecerabines;
                        item.totalcabeceraconica = totalcabeceraconica;
                        item.totalcabeceracalada = totalcabeceracalada;
                        item.totalcabecerahielo  = totalcabecerahielo;
                        item.totalcabecerameta   = totalcabecerameta;
                        item.totalcabecerasal    = totalcabecerasal;

                    }

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }


    async getInformacionMovilesbyIdPlanificacionDetalle(idplanificaciondetalle){
        try {
            let detalle = await db.query(` select ld.idlogisticadespacho id , ld.idplanificaciondetalle , 
                                            ld.idbiologo ,
                                            (e.nombre || ' '|| e.apellido) biologo,
                                            ld.idtransporte , t.descripcion::text transporte ,
                                            t.url , t.usuario , t.clave,
                                            (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) idmaterialbines ,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) bines ,
                                            (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) idmaterialconica ,
                                            (select case when ldm.cantidad is null then '' else ldm.cantidad::text end from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conica,	
                                            (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) idmaterialcalada ,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) calada,												 
                                            (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) idmaterialhielo ,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hielo , 
                                            ld.idproveedorhielo,
                                            ph.descripcion::text proveedorhielo,  
                                            (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) idmaterialmeta ,  
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) meta,
                                            tme.descripcion tipometa,
                                            (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) idmaterialsal ,  
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                            where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) sal,
                                            (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) binesretorno,
                                            (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hieloretorno,
                                            (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) metaretorno,
                                            (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) salretorno,
                                            (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conicaretorno,
                                            (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) caladaretorno,
                                            ld.cantidadprogramada , ld.estadoviaje,
                                            ld.idoperadorlogistico ,
											opl.descripcion::text operadorlogistico,
                                            ld.idsucursal , 
											su.descripcion sucursal ,
                                            ld.idconductor ,
											(ec.nombre || ' '|| ec.apellido) conductor,
                                            ec.cedula , ec.telefono,
                                            ld.piloto , ld.copiloto,
                                            ld.horadespacho, ld.horasalidaorigen, ld.horaarribocamaronera, ld.horasalidacamaronera,
                                            ld.horaarribocliente, ld.horaretorno, ld.observacion
                                            ,ldg.id idlogisticadespachoguia ,ldg.numeroguia
                                            ,d.idpiscina, pc.descripcion piscina,
                                            c.idproveedor, p.descripcion proveedor,
                        					c.idcliente, cli.etiqueta cliente  
                                    from logistica_despacho ld 
                                    left join logistica_despacho_guia ldg on ldg.idlogisticadespacho = ld.idlogisticadespacho
                                    left join tm_transporte t on t.id = ld.idtransporte 
                                    left  join tm_proveedor ph on ph.id = ld.idproveedorhielo
                                    left  join tm_empleado  e on e.id = ld.idbiologo
                                    left  join tm_proveedor opl on opl.id = ld.idoperadorlogistico
                                    left  join tm_sucursal su on su.id = ld.idsucursal
                                    left  join tm_empleado ec on ec.id = ld.idconductor 
                                    left join planificacion_programa_detalle d on d.id = ld.idplanificaciondetalle 
                                    left join tm_piscina pc on pc.id = d.idpiscina 
                                    inner join planificacion_programa_cabecera c on c.id = d.idprogramapesca 
                                    left join tm_proveedor p on p.id = c.idproveedor
                                    left join tm_cliente cli on cli.id = c.idcliente 
                                    left join tm_tipo_metabisulfito tme on tme.id = ld.idtipometabisulfito 
                                    where ld.idplanificaciondetalle = $1 and ld.estado = 1 order by ld.idlogisticadespacho asc `,[idplanificaciondetalle]);
            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }




    async getProgramaDetalleLogisticabyIdAguajeExport(idaguaje ){
        console.log('idaguaje->' , idaguaje )
        try {
            let detalle = await db.query(`
            select n.fechadespacho, n.proveedor camaronera , n.sector , n.piscina, n.librasprogramada, n.cliente , n.gramaje, n.tipoproceso tipo, n.sucursal base,
            coalesce(n.numeroguia,'') guia, n.biologo,n.campamento, coalesce(n.transporte,'') transporte, coalesce(n.conductor,'') conductor,
            coalesce(n.cedula,'') cedula, coalesce(n.telefono,'') telefono, n.proveedorhielo, n.bines , n.hielo , n.meta , n.sal , n.conica , n.calada ,
            n.cantidadprogramada librasmovil ,  coalesce(n.piloto,'')piloto ,  coalesce(n.copiloto,'')copiloto , 
            coalesce(n.selloentrada,'')selloentrada,  coalesce(n.sellosalida,'')sellosalida,
            coalesce(n.url,'') url, coalesce(n.usuario,'') usuario, coalesce(n.clave,'') clave
            ,n.observacioncompras , n.observacion ,n.muelle
            from(
                select n1.* , n2.*
                from(
                            SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
                                    d.idpiscina, pc.descripcion piscina,
                                    d.cantidadprogramada librasprogramada, 
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
                                    , tm.descripcion muelle 	 
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
                                left join tm_muelle tm on tm.id = d.idmuelle
                                where c.idaguaje = $1                          
                                and c.estado = 1 and d.estado = 1 order by d.id asc
                        )n1
                        left join               
                            (
                                select ld.idlogisticadespacho  , ld.idplanificaciondetalle , 
                                                        ld.idbiologo ,
                                                        (e.nombre || ' '|| e.apellido) biologo,
                                                        ld.idtransporte , t.descripcion::text transporte ,
                                                        t.url , t.usuario , t.clave,
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) idmaterialbines ,
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) bines ,
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) idmaterialconica ,
                                                        (select case when ldm.cantidad is null then '' else ldm.cantidad::text end from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conica,	
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) idmaterialcalada ,
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) calada,												 
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) idmaterialhielo ,
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hielo , 
                                                        ld.idproveedorhielo,
                                                        ph.descripcion::text proveedorhielo,  
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) idmaterialmeta ,  
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) meta,
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) idmaterialsal ,  
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) sal,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) binesretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hieloretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) metaretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) salretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conicaretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) caladaretorno,
                                                        ld.cantidadprogramada , ld.estadoviaje,
                                                        ld.idoperadorlogistico ,
                                                        opl.descripcion::text operadorlogistico,
                                                        ld.idsucursal , 
                                                        su.descripcion sucursal ,
                                                        ld.idconductor ,
                                                        (ec.nombre || ' '|| ec.apellido) conductor,
                                                        ec.cedula , ec.telefono,
                                                        ld.piloto , ld.copiloto,
                                                        ld.horadespacho, ld.horasalidaorigen, ld.horaarribocamaronera, ld.horasalidacamaronera,
                                                        ld.horaarribocliente, ld.horaretorno, ld.observacion
                                                        ,ldg.id idlogisticadespachoguia ,ldg.numeroguia , ld.selloentrada , ld.sellosalida 
                                                from logistica_despacho ld 
                                                left join logistica_despacho_guia ldg on ldg.idlogisticadespacho = ld.idlogisticadespacho
                                                left join tm_transporte t on t.id = ld.idtransporte 
                                                left  join tm_proveedor ph on ph.id = ld.idproveedorhielo
                                                left  join tm_empleado  e on e.id = ld.idbiologo
                                                left  join tm_proveedor opl on opl.id = ld.idoperadorlogistico
                                                left  join tm_sucursal su on su.id = ld.idsucursal
                                                left  join tm_empleado ec on ec.id = ld.idconductor 
                                            -- where ld.idplanificaciondetalle = n1.id --251 --$1 
                                                and ld.estado = 1     
                                    )n2 on n1.id = n2.idplanificaciondetalle  
                        )n order by n.id asc , n.numeroguia asc    
            `,[idaguaje  ])  
            return detalle.rows;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
   }


    async getProgramaDetalleLogisticabyIdAguajeAndFechaDespachoExport(idaguaje , fechadespacho){
        console.log('idaguaje->' , idaguaje , 'fechadespacho->' , fechadespacho)
        try {
            let detalle = await db.query(`
            select n.fechadespacho, n.proveedor camaronera , n.sector , n.piscina, n.librasprogramada, n.cliente , n.gramaje, n.tipoproceso tipo, n.sucursal base,
            coalesce(n.numeroguia,'') guia, n.biologo,n.campamento, coalesce(n.transporte,'') transporte, coalesce(n.conductor,'') conductor,
            coalesce(n.cedula,'') cedula, coalesce(n.telefono,'') telefono, n.proveedorhielo, n.bines , n.hielo , n.meta , n.sal , n.conica , n.calada ,
            n.cantidadprogramada librasmovil ,  coalesce(n.piloto,'')piloto ,  coalesce(n.copiloto,'')copiloto , 
            coalesce(n.selloentrada,'')selloentrada,  coalesce(n.sellosalida,'')sellosalida,
            coalesce(n.url,'') url, coalesce(n.usuario,'') usuario, coalesce(n.clave,'') clave
            ,n.observacioncompras , n.observacion ,n.muelle
            from(
                select n1.* , n2.*
                from(
                            SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
                                    d.idpiscina, pc.descripcion piscina,
                                    d.cantidadprogramada librasprogramada, 
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
                                    , tm.descripcion muelle 	 
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
                                left join tm_muelle tm on tm.id = d.idmuelle
                                where c.idaguaje = $1     
                                and c.fechadespacho = $2                      
                                and c.estado = 1 and d.estado = 1 order by d.id asc
                        )n1
                        left join               
                            (
                                select ld.idlogisticadespacho  , ld.idplanificaciondetalle , 
                                                        ld.idbiologo ,
                                                        (e.nombre || ' '|| e.apellido) biologo,
                                                        ld.idtransporte , t.descripcion::text transporte ,
                                                        t.url , t.usuario , t.clave,
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) idmaterialbines ,
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) bines ,
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) idmaterialconica ,
                                                        (select case when ldm.cantidad is null then '' else ldm.cantidad::text end from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conica,	
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) idmaterialcalada ,
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) calada,												 
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) idmaterialhielo ,
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hielo , 
                                                        ld.idproveedorhielo,
                                                        ph.descripcion::text proveedorhielo,  
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) idmaterialmeta ,  
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) meta,
                                                        (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) idmaterialsal ,  
                                                        (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                        where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) sal,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) binesretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hieloretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) metaretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) salretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conicaretorno,
                                                        (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) caladaretorno,
                                                        ld.cantidadprogramada , ld.estadoviaje,
                                                        ld.idoperadorlogistico ,
                                                        opl.descripcion::text operadorlogistico,
                                                        ld.idsucursal , 
                                                        su.descripcion sucursal ,
                                                        ld.idconductor ,
                                                        (ec.nombre || ' '|| ec.apellido) conductor,
                                                        ec.cedula , ec.telefono,
                                                        ld.piloto , ld.copiloto,
                                                        ld.horadespacho, ld.horasalidaorigen, ld.horaarribocamaronera, ld.horasalidacamaronera,
                                                        ld.horaarribocliente, ld.horaretorno, ld.observacion
                                                        ,ldg.id idlogisticadespachoguia ,ldg.numeroguia , ld.selloentrada , ld.sellosalida 
                                                from logistica_despacho ld 
                                                left join logistica_despacho_guia ldg on ldg.idlogisticadespacho = ld.idlogisticadespacho
                                                left join tm_transporte t on t.id = ld.idtransporte 
                                                left  join tm_proveedor ph on ph.id = ld.idproveedorhielo
                                                left  join tm_empleado  e on e.id = ld.idbiologo
                                                left  join tm_proveedor opl on opl.id = ld.idoperadorlogistico
                                                left  join tm_sucursal su on su.id = ld.idsucursal
                                                left  join tm_empleado ec on ec.id = ld.idconductor 
                                            -- where ld.idplanificaciondetalle = n1.id --251 --$1 
                                                and ld.estado = 1     
                                    )n2 on n1.id = n2.idplanificaciondetalle  
                        )n order by n.id asc , n.numeroguia asc 
            `,[idaguaje , fechadespacho ])  
            return detalle.rows;
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
   }


   async getProgramaDetalleLogisticaMonitorbyIdAguajeAndFechaDespachoExport(idaguaje , fechadespacho){
            console.log('idaguaje->' , idaguaje , 'fechadespacho->' , fechadespacho)
            try {
                let detalle = await db.query(`
                                    select n.fechadespacho, n.proveedor camaronera , n.sector , n.piscina, n.librasprogramada, n.cliente , n.gramaje, n.tipoproceso tipo, n.sucursal base,
                                        coalesce(n.numeroguia,'') guia, n.biologo,n.campamento, coalesce(n.transporte,'') transporte, coalesce(n.conductor,'') conductor,
                                        coalesce(n.cedula,'') cedula, coalesce(n.telefono,'') telefono, n.proveedorhielo, n.bines , n.hielo , n.meta , n.sal , n.conica , n.calada ,
                                        n.cantidadprogramada librasmovil ,  coalesce(n.piloto,'')piloto ,  coalesce(n.copiloto,'')copiloto , 
                                        coalesce(n.selloentrada,'')selloentrada,  coalesce(n.sellosalida,'')sellosalida,
                                        coalesce(n.url,'') url, coalesce(n.usuario,'') usuario, coalesce(n.clave,'') clave
                                        ,n.observacioncompras , n.observacion
                                        ,n.observacionguia
                                        ,to_char(  n.horadespacho , 'HH12:MI:SS PM' ) horadespacho
                                        ,to_char(  n.horasalidaorigen , 'HH12:MI:SS PM' ) horasalidaorigen
                                        ,to_char(  n.horaarribocamaronera , 'HH12:MI:SS PM' ) horaarribocamaronera
                                        ,to_char(  n.horasalidacamaronera , 'HH12:MI:SS PM' ) horasalidacamaronera
                                        ,to_char(  n.horaarribocliente , 'HH12:MI:SS PM' ) horaarribocliente
                                        ,to_char(  n.horaretorno , 'HH12:MI:SS PM' ) horaretorno 
                                        ,n.muelle
                                    from(
                                        select n1.* , n2.*
                                        from(
                                                    SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
                                                            d.idpiscina, pc.descripcion piscina,
                                                            d.cantidadprogramada librasprogramada, 
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
                                                            , tm.descripcion muelle	 
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
                                                        left join tm_muelle tm on tm.id = d.idmuelle 
                                                        where c.idaguaje = $1   
                                                        and c.fechadespacho = $2                      
                                                        and c.estado = 1 and d.estado = 1 order by d.id asc
                                                )n1
                                                left join               
                                                    (
                                                        select ld.idlogisticadespacho  , ld.idplanificaciondetalle , 
                                                                                ld.idbiologo ,
                                                                                (e.nombre || ' '|| e.apellido) biologo,
                                                                                ld.idtransporte , t.descripcion::text transporte ,
                                                                                t.url , t.usuario , t.clave,
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) idmaterialbines ,
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) bines ,
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) idmaterialconica ,
                                                                                (select case when ldm.cantidad is null then '' else ldm.cantidad::text end from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conica,	
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) idmaterialcalada ,
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) calada,												 
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) idmaterialhielo ,
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hielo , 
                                                                                ld.idproveedorhielo,
                                                                                ph.descripcion::text proveedorhielo,  
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) idmaterialmeta ,  
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) meta,
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) idmaterialsal ,  
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) sal,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) binesretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hieloretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) metaretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) salretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conicaretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) caladaretorno,
                                                                                ld.cantidadprogramada , ld.estadoviaje,
                                                                                ld.idoperadorlogistico ,
                                                                                opl.descripcion::text operadorlogistico,
                                                                                ld.idsucursal , 
                                                                                su.descripcion sucursal ,
                                                                                ld.idconductor ,
                                                                                (ec.nombre || ' '|| ec.apellido) conductor,
                                                                                ec.cedula , ec.telefono,
                                                                                ld.piloto , ld.copiloto,
                                                                                ld.horadespacho, ld.horasalidaorigen, ld.horaarribocamaronera, ld.horasalidacamaronera,
                                                                                ld.horaarribocliente, ld.horaretorno, ld.observacion
                                                                                ,ldg.id idlogisticadespachoguia ,ldg.numeroguia , ld.selloentrada , ld.sellosalida 
                                                                                , ld.ordencompra observacionguia 
                                                                        from logistica_despacho ld 
                                                                        left join logistica_despacho_guia ldg on ldg.idlogisticadespacho = ld.idlogisticadespacho
                                                                        left join tm_transporte t on t.id = ld.idtransporte 
                                                                        left  join tm_proveedor ph on ph.id = ld.idproveedorhielo
                                                                        left  join tm_empleado  e on e.id = ld.idbiologo
                                                                        left  join tm_proveedor opl on opl.id = ld.idoperadorlogistico
                                                                        left  join tm_sucursal su on su.id = ld.idsucursal
                                                                        left  join tm_empleado ec on ec.id = ld.idconductor 
                                                                    -- where ld.idplanificaciondetalle = n1.id --251 --$1 
                                                                        and ld.estado = 1     
                                                            )n2 on n1.id = n2.idplanificaciondetalle  
                                                )n order by n.id asc , n.numeroguia asc 
                                    `,[idaguaje , fechadespacho ])  
                        return detalle.rows;
                    } catch (error) {
                        console.log(error)
                        throw new Error(error)
            }    
    }


    async getProgramaDetalleLogisticaMonitorbyIdAguajeExport(idaguaje){
        console.log('idaguaje->' , idaguaje )
        try {
            let detalle = await db.query(`
                                    select n.fechadespacho, n.proveedor camaronera , n.sector , n.piscina, n.librasprogramada, n.cliente , n.gramaje, n.tipoproceso tipo, n.sucursal base,
                                        coalesce(n.numeroguia,'') guia, n.biologo,n.campamento, coalesce(n.transporte,'') transporte, coalesce(n.conductor,'') conductor,
                                        coalesce(n.cedula,'') cedula, coalesce(n.telefono,'') telefono, n.proveedorhielo, n.bines , n.hielo , n.meta , n.sal , n.conica , n.calada ,
                                        n.cantidadprogramada librasmovil ,  coalesce(n.piloto,'')piloto ,  coalesce(n.copiloto,'')copiloto , 
                                        coalesce(n.selloentrada,'')selloentrada,  coalesce(n.sellosalida,'')sellosalida,
                                        coalesce(n.url,'') url, coalesce(n.usuario,'') usuario, coalesce(n.clave,'') clave
                                        ,n.observacioncompras , n.observacion
                                        ,n.observacionguia
                                        ,to_char(  n.horadespacho , 'HH12:MI:SS PM' ) horadespacho
                                        ,to_char(  n.horasalidaorigen , 'HH12:MI:SS PM' ) horasalidaorigen
                                        ,to_char(  n.horaarribocamaronera , 'HH12:MI:SS PM' ) horaarribocamaronera
                                        ,to_char(  n.horasalidacamaronera , 'HH12:MI:SS PM' ) horasalidacamaronera
                                        ,to_char(  n.horaarribocliente , 'HH12:MI:SS PM' ) horaarribocliente
                                        ,to_char(  n.horaretorno , 'HH12:MI:SS PM' ) horaretorno 
                                        ,n.muelle
                                    from(
                                        select n1.* , n2.*
                                        from(
                                                    SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
                                                            d.idpiscina, pc.descripcion piscina,
                                                            d.cantidadprogramada librasprogramada, 
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
                                                            , tm.descripcion muelle 	 
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
                                                        left join tm_muelle tm on tm.id = d.idmuelle 
                                                        where c.idaguaje = $1                                                                      
                                                        and c.estado = 1 and d.estado = 1 order by d.id asc
                                                )n1
                                                left join               
                                                    (
                                                        select ld.idlogisticadespacho  , ld.idplanificaciondetalle , 
                                                                                ld.idbiologo ,
                                                                                (e.nombre || ' '|| e.apellido) biologo,
                                                                                ld.idtransporte , t.descripcion::text transporte ,
                                                                                t.url , t.usuario , t.clave,
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) idmaterialbines ,
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) bines ,
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) idmaterialconica ,
                                                                                (select case when ldm.cantidad is null then '' else ldm.cantidad::text end from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conica,	
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) idmaterialcalada ,
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) calada,												 
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) idmaterialhielo ,
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hielo , 
                                                                                ld.idproveedorhielo,
                                                                                ph.descripcion::text proveedorhielo,  
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) idmaterialmeta ,  
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) meta,
                                                                                (select ldm.idlogisticadespachomaterial from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) idmaterialsal ,  
                                                                                (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) sal,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) binesretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hieloretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) metaretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) salretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conicaretorno,
                                                                                (select ldm.cantidadretorno from logistica_despacho_materiales ldm where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) caladaretorno,
                                                                                ld.cantidadprogramada , ld.estadoviaje,
                                                                                ld.idoperadorlogistico ,
                                                                                opl.descripcion::text operadorlogistico,
                                                                                ld.idsucursal , 
                                                                                su.descripcion sucursal ,
                                                                                ld.idconductor ,
                                                                                (ec.nombre || ' '|| ec.apellido) conductor,
                                                                                ec.cedula , ec.telefono,
                                                                                ld.piloto , ld.copiloto,
                                                                                ld.horadespacho, ld.horasalidaorigen, ld.horaarribocamaronera, ld.horasalidacamaronera,
                                                                                ld.horaarribocliente, ld.horaretorno, ld.observacion
                                                                                ,ldg.id idlogisticadespachoguia ,ldg.numeroguia , ld.selloentrada , ld.sellosalida 
                                                                                , ld.ordencompra observacionguia 
                                                                        from logistica_despacho ld 
                                                                        left join logistica_despacho_guia ldg on ldg.idlogisticadespacho = ld.idlogisticadespacho
                                                                        left join tm_transporte t on t.id = ld.idtransporte 
                                                                        left  join tm_proveedor ph on ph.id = ld.idproveedorhielo
                                                                        left  join tm_empleado  e on e.id = ld.idbiologo
                                                                        left  join tm_proveedor opl on opl.id = ld.idoperadorlogistico
                                                                        left  join tm_sucursal su on su.id = ld.idsucursal
                                                                        left  join tm_empleado ec on ec.id = ld.idconductor 
                                                                    -- where ld.idplanificaciondetalle = n1.id --251 --$1 
                                                                        and ld.estado = 1     
                                                            )n2 on n1.id = n2.idplanificaciondetalle  
                                                )n order by n.id asc , n.numeroguia asc 
                                    `,[idaguaje ])  
                        return detalle.rows;
                    } catch (error) {
                        console.log(error)
                        throw new Error(error)
            }    
    }



    async getImpresionDocumentosbyIdAguaje(idaguaje){
        console.log('idaguaje->' , idaguaje)
        try {
            let detalle = await db.query(`SELECT ld.idlogisticadespacho id ,  d.id idprogramadetalle, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
                                            d.idpiscina, pc.descripcion piscina,
                                            d.cantidadprogramada, 
                                            d.cantidadconfirmada, d.idviatransporte,
                                            d.confirmada, d.fecharegistropesca, d.fechaconfirmacionpesca, d.fechamaterialescampo,
                                            d.idusuarioprogramacion, d.idusuarioconfirmacion, d.cantidadtransporteterrestre, 
                                            d.idtipotransporte, d.gramaje, d.cantidadtransportemaritimo, d.observacioncompras,
                                            d.numeropuerta, d.idmetodocosecha, mc.descripcion metodocosecha, c.fechadespacho, d.tpe, d.estado, d.fechaarriboplanta,
                                            ld.horaarribocamaronera,
                                            c.idproveedor, p.descripcion proveedor, p.identificacion::text identificacionproveedor ,
                                            c.idcliente, cli.etiqueta cliente, 
                                            c.idcomprador, e.nombre ||' '|| e.apellido comprador,
                                            c.idusuario, c.idtipoproceso , pt.descripcion tipoproceso,
                                            c.estado estadocabecera
                                            ,( SELECT   sum(d.cantidadconfirmada) librasaguaje 
                                                    FROM planificacion_programa_detalle d
                                            inner join planificacion_programa_cabecera cc on cc.id = d.idprogramapesca
                                            where cc.idaguaje = c.idaguaje) librasaguaje ,
                                            ld.idconductor ,
                                            (ec.nombre || ' '|| ec.apellido) conductor ,
                                            ec.cedula identificacionconductor ,
                                            ec.cedula , ec.telefono,
                                            ld.idtransporte , t.descripcion::text transporte
                                            ,ld.idlogisticadespacho
                                            ,ld.cantidadprogramada cantidadprogramadamovil
                                            ,ld.selloentrada , ld.sellosalida , ldg.id idlogisticadespachoguia
                                            ,ldg.numeroguia , ldg.estadosri , ldg.autorizacion ,
                                            --coalesce((ld.selloentrada || ' ' || ld.sellosalida),'') sellos,
                                            ( coalesce ( (ld.selloentrada) , '') || ' ' || coalesce ( (ld.sellosalida) , '') ) sellos,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 1) codigobines,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 2) codigohielo,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 3) codigometa,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 4) codigosal,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 5) codigoconica,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 6) codigocalada,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 1) labelbines,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 2) labelhielo,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 3) labelmeta,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 4) labelsal,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 5) labelconica,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 6) labelcalada,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) bines ,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hielo ,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) meta,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) sal, 
                                                                                    (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conica,
                                                                                    (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) calada  
                                            , d.idsociedad , d.idsectorcliente, coalesce ( (spc.descripcion) , '') sectorcliente	
                                            , coalesce ( (sp.descripcion) , '') rutasalida  
                                            , coalesce ( (spc.descripcion) , '') rutallegada  
                                            --, ( coalesce ( (sp.descripcion) , '') || '-' || coalesce ( (spc.descripcion) , '') ||'-'|| coalesce ( (sp.descripcion) , '')) ruta
                                            , ( coalesce ( (su.descripcion) , '') || '-' || coalesce ( (sp.descripcion) , '') ||'-'|| coalesce ( (spc.descripcion) , '')) ruta
                                            , cs.direccionenviadas , cs.direccionautorizadas , cs.direccionanuladas , ld.motivotraslado , ld.ordencompra --, ld.ruta
                                            , ld.idsucursal , su.descripcion base
                                            , d.idmuelle , mu.descripcion muelle , ldg.fechaautorizacion , cs.direccionconsultapdf  ,css.puntoemision , css.establecimiento
                                            , coalesce ( ld.piloto , '') piloto  , coalesce ( ld.copiloto , '') copiloto
                                            , ( coalesce ( (ld.piloto) , 'NA') || ' ' || coalesce ( (ld.copiloto) , '') ) binescarro
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
                                        inner join logistica_despacho ld on ld.idplanificaciondetalle = d.id
                                        left join logistica_despacho_guia ldg on ldg.idlogisticadespacho = ld.idlogisticadespacho
                                        left  join tm_empleado ec on ec.id = ld.idconductor 
                                        left join tm_transporte t on t.id = ld.idtransporte 
                                        left join tm_sector_pesca spc on spc.id = d.idsectorcliente 
                                        left join core_sociedad cs on cs.id = d.idsociedad
                                        left join core_sociedad_secuencia css on css.idsociedad = cs.id 
                                        left join tm_sucursal su on su.id = ld.idsucursal
                                        left join tm_muelle mu on mu.id = d.idmuelle
                                        where c.idaguaje = $1 and c.estado = 1 and d.estado = 1 
                                        order by ld.idlogisticadespacho asc `,[idaguaje ])  //d.id asc , d.idprogramapesca asc

            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }


    async getImpresionDocumentosbyIdAguajeAndFechaDespacho(idaguaje , fechadespacho){
        console.log('idaguaje->' , idaguaje , 'fechadespacho->' , fechadespacho)
        try {
            let detalle = await db.query(`SELECT ld.idlogisticadespacho id ,  d.id idprogramadetalle, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
                                            d.idpiscina, pc.descripcion piscina,
                                            d.cantidadprogramada, 
                                            d.cantidadconfirmada, d.idviatransporte,
                                            d.confirmada, d.fecharegistropesca, d.fechaconfirmacionpesca, d.fechamaterialescampo,
                                            d.idusuarioprogramacion, d.idusuarioconfirmacion, d.cantidadtransporteterrestre, 
                                            d.idtipotransporte, d.gramaje, d.cantidadtransportemaritimo, d.observacioncompras,
                                            d.numeropuerta, d.idmetodocosecha, mc.descripcion metodocosecha, c.fechadespacho, d.tpe, d.estado, d.fechaarriboplanta,
                                            ld.horaarribocamaronera,
                                            c.idproveedor, p.descripcion proveedor, p.identificacion::text identificacionproveedor ,
                                            c.idcliente, cli.etiqueta cliente, 
                                            c.idcomprador, e.nombre ||' '|| e.apellido comprador,
                                            c.idusuario, c.idtipoproceso , pt.descripcion tipoproceso,
                                            c.estado estadocabecera
                                            ,( SELECT   sum(d.cantidadconfirmada) librasaguaje 
                                                    FROM planificacion_programa_detalle d
                                            inner join planificacion_programa_cabecera cc on cc.id = d.idprogramapesca
                                            where cc.idaguaje = c.idaguaje) librasaguaje ,
                                            ld.idconductor ,
                                            (ec.nombre || ' '|| ec.apellido) conductor ,
                                            ec.cedula identificacionconductor ,
                                            ec.cedula , ec.telefono,
                                            ld.idtransporte , t.descripcion::text transporte
                                            ,ld.idlogisticadespacho
                                            ,ld.cantidadprogramada cantidadprogramadamovil
                                            ,ld.selloentrada , ld.sellosalida , ldg.id idlogisticadespachoguia
                                            ,ldg.numeroguia , ldg.estadosri , ldg.autorizacion ,
                                            --coalesce((ld.selloentrada || ' ' || ld.sellosalida),'') sellos,
                                            ( coalesce ( (ld.selloentrada) , '') || ' ' || coalesce ( (ld.sellosalida) , '') ) sellos,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 1) codigobines,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 2) codigohielo,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 3) codigometa,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 4) codigosal,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 5) codigoconica,
                                            (select pro.codigoalterno from tm_producto pro where pro.idproducto = 6) codigocalada,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 1) labelbines,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 2) labelhielo,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 3) labelmeta,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 4) labelsal,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 5) labelconica,
                                            (select pro.descripcion from tm_producto pro where pro.idproducto = 6) labelcalada,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 1 ) bines ,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 2 ) hielo ,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 3 ) meta,
                                            (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 4 ) sal, 
                                                                                    (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 5 ) conica,
                                                                                    (select ldm.cantidad from logistica_despacho_materiales ldm 
                                                where ldm.idlogisticadespacho = ld.idlogisticadespacho and ldm.idproducto = 6 ) calada  
                                            , d.idsociedad , d.idsectorcliente, coalesce ( (spc.descripcion) , '') sectorcliente	
                                            , coalesce ( (sp.descripcion) , '') rutasalida  
                                            , coalesce ( (spc.descripcion) , '') rutallegada  
                                            --, ( coalesce ( (sp.descripcion) , '') || '-' || coalesce ( (spc.descripcion) , '') ||'-'|| coalesce ( (sp.descripcion) , '')) ruta
                                            , ( coalesce ( (su.descripcion) , '') || '-' || coalesce ( (sp.descripcion) , '') ||'-'|| coalesce ( (spc.descripcion) , '')) ruta
                                            , cs.direccionenviadas , cs.direccionautorizadas , cs.direccionanuladas , ld.motivotraslado , ld.ordencompra --, ld.ruta
                                            , ld.idsucursal , su.descripcion base 
                                            , d.idmuelle , mu.descripcion muelle , ldg.fechaautorizacion ,cs.direccionconsultapdf  ,css.puntoemision , css.establecimiento
                                            , coalesce ( ld.piloto , 'NA') piloto  , coalesce ( ld.copiloto , 'NA') copiloto
                                            , ( coalesce ( (ld.piloto) , 'NA') || ' ' || coalesce ( (ld.copiloto) , '') ) binescarro
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
                                        inner join logistica_despacho ld on ld.idplanificaciondetalle = d.id
                                        left join logistica_despacho_guia ldg on ldg.idlogisticadespacho = ld.idlogisticadespacho
                                        left  join tm_empleado ec on ec.id = ld.idconductor 
                                        left join tm_transporte t on t.id = ld.idtransporte 
                                        left join tm_sector_pesca spc on spc.id = d.idsectorcliente 
                                        left join core_sociedad cs on cs.id = d.idsociedad 
                                        left join core_sociedad_secuencia css on css.idsociedad = cs.id 
                                        left join tm_sucursal su on su.id = ld.idsucursal
                                        left join tm_muelle mu on mu.id = d.idmuelle
                                        where c.idaguaje = $1 and c.fechadespacho = $2 and c.estado = 1 and d.estado = 1 
                                        order by ld.idlogisticadespacho asc `,[idaguaje,fechadespacho])  //d.id asc , d.idprogramapesca asc
            return detalle.rows;
         } catch (error) {
             console.log(error)
             throw new Error(error)
         }    
    }


    async getTransporte() {
        let results = await db.query(`SELECT * 
                                     FROM tm_transporte where estado = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }

    async getBiologo() {
        let results = await db.query(`SELECT * 
                                      FROM tm_empleado where estado = 1 and idcargoempleado = 3 order by apellido asc`)
                                      .catch(console.log);
        return results.rows;
    }

    /**
     * El producto id 1 es el de bines
     * @returns 
     */
    async getBinesDisponibles() {
        let results = await db.query(`SELECT * 
                                     FROM tm_producto_detalle where idproducto = 1 and estado = 1 and disponible = 1 order by descripcion asc`)
                                     .catch(console.log);
        return results.rows;
    }

    /**
     * Actualizacion de item 
     * se envia el campo dinamicamente dentro del objeto
     * @param {*} objeto 
     * @returns 
     */
    async updateLogisticaDespacho(objeto){
        console.log('objeto recb->', objeto);
        try {
            await db.query(`UPDATE logistica_despacho SET ${objeto.campo}=$2 WHERE idlogisticadespacho=$1 `, 
                [ objeto.id ,  objeto.valor ])
            return objeto;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } 
    }


    async updateLogisticaDespachoMaterial(objeto){
        console.log('objeto recb->', objeto);
        try {
            await db.query(`UPDATE logistica_despacho_materiales SET ${objeto.campo}=$2 WHERE idlogisticadespachomaterial =$1 `, 
                [ objeto.id ,  objeto.valor ]);
            if(objeto.campo == 'cantidadretorno')
                await db.query(`UPDATE logistica_despacho_materiales SET fecharetorno=now() WHERE idlogisticadespachomaterial =$1 `, [ objeto.id ]);
            return objeto;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } 
    }


    async createLogisticaDespachoEmpty(objeto){
        //console.log('objeto recb->', objeto);
        try {
           let data =  await db.query(`INSERT INTO logistica_despacho (idplanificaciondetalle , idusuario, fecharegistro , estado) values ($1 , $2, now() , 1) RETURNING idlogisticadespacho `, 
                [ objeto.idplanificaciondetalle , objeto.idusuario ]);
            //con el id recuperado se debe generar los despacho de materiales que se llenaron posteriormente en la edicion
            //insertar producto bines
            await db.query(`INSERT INTO logistica_despacho_materiales (idlogisticadespacho , idproducto , idusuario , fecharegistro , estado ) values ($1 , $2 , $3, now() , 1 ) `, 
                [ data.rows[0].idlogisticadespacho , 1 , objeto.idusuario ]);
            //insertar producto hielo
            await db.query(`INSERT INTO logistica_despacho_materiales (idlogisticadespacho , idproducto , idusuario , fecharegistro , estado ) values ($1 , $2 , $3, now() , 1 ) `, 
                [ data.rows[0].idlogisticadespacho , 2 , objeto.idusuario ]);
            //insertar producto meta
            await db.query(`INSERT INTO logistica_despacho_materiales (idlogisticadespacho , idproducto , idusuario , fecharegistro , estado ) values ($1 , $2 , $3, now() , 1 ) `, 
                [ data.rows[0].idlogisticadespacho , 3 , objeto.idusuario ]);
            //insertar producto sal
            await db.query(`INSERT INTO logistica_despacho_materiales (idlogisticadespacho , idproducto , idusuario , fecharegistro , estado ) values ($1 , $2 , $3, now() , 1 ) `, 
                [ data.rows[0].idlogisticadespacho , 4 , objeto.idusuario ]);
            //insertar producto gaviotas conicas
            await db.query(`INSERT INTO logistica_despacho_materiales (idlogisticadespacho , idproducto , idusuario , fecharegistro , estado ) values ($1 , $2 , $3, now() , 1 ) `, 
                [ data.rows[0].idlogisticadespacho , 5 , objeto.idusuario ]); 
            //insertar producto gaviotas caladas
            await db.query(`INSERT INTO logistica_despacho_materiales (idlogisticadespacho , idproducto , idusuario , fecharegistro , estado ) values ($1 , $2 , $3, now() , 1 ) `, 
                [ data.rows[0].idlogisticadespacho , 6 , objeto.idusuario ]);        

            return objeto;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        } 
    }

    async getArchivoTipoV1(iddocumento,tipo){
        try {
            //let nameDocumento="001-002-000000099";

            // let results = await db.query(`SELECT * FROM tablaguia where id = $1`, [iddocumento]);
            // nameDocumento = results.rows[0].numeroguia;
            console.log('iddocumento ->' + iddocumento)
            if(tipo == 1)
                return params.rutaguia.filepdf + iddocumento + '.pdf'; //nameDocumento
            else 
                return params.rutaguia.filaxml + iddocumento + '.xml'; //nameDocumento
        } catch (e) {
            throw  new Error(e);
        }
    }


    async getArchivoTipo(iddocumento, tipo ,idsociedad){
        try {
            console.log('iddocumento ->' + iddocumento)

            let rutapdf="";
            let rutaxml="";

             let results = await db.query(`SELECT * FROM core_sociedad where id = $1`, [idsociedad]);
             rutapdf = results.rows[0].direccionconsultapdf; //direccionenviadas;
             rutaxml = results.rows[0].direccionautorizadas;

            if(tipo == 1){
               //ejemplo rutapdf: 'C:/home/metric_erp/0993369938001/factue/enviadas/'
                console.log('ruta pdf armada ->' + rutapdf + '/' + iddocumento + '.pdf')
                return rutapdf + '/' + iddocumento + '.pdf';  
            }
            else{
                console.log('ruta xml armada ->' + rutaxml + '/' + iddocumento + '.pdf')
                return rutaxml + '/' + iddocumento + '.xml';  
            }
        } catch (e) {
            throw  new Error(e);
        }
    }
    
    /*
    async getArchivoTipo(iddocumento, tipo , rutapdf , rutaxml){
        try {
            console.log('iddocumento ->' + iddocumento)
            if(tipo == 1){
               //ejemplo rutapdf: 'C:/home/metric_erp/0993369938001/factue/enviadas/'
                console.log('ruta pdf armada ->' + rutapdf + '/' + iddocumento + '.pdf')
                return rutapdf + '/' + iddocumento + '.pdf';  
            }
            else{
                console.log('ruta xml armada ->' + rutaxml + '/' + iddocumento + '.pdf')
                return rutaxml + '/' + iddocumento + '.xml';  
            }
        } catch (e) {
            throw  new Error(e);
        }
    }

    */

    async createOrUpdateLogisticaDespachoGuiaVA(data) {
        try {
            let resul;

                // traer los parametros establecimiento , pto emision y secuencia actual ,
                // luego genero la secuencia 
                // despues llamar al servicio de guia desde el front y a este le paso la secuencia generada
                // si da un error la generacion de guia , debo devolver la secuencia original 
                let empresasecuencia = await db.query(`SELECT * FROM core_empresa_secuencia where idempresa = $1`, [1]);//despues enviar por parametro
                let secuenciagenerada = Number(empresasecuencia.rows[0].secuencia);
                await db.query(`UPDATE core_empresa_secuencia set secuencia = $2 where idempresa = $1`, [1 , Number(secuenciagenerada + 1)]);
                //agrego los parametros adicionales al objeto recibido
                data.secuenciagenerada = Number(secuenciagenerada + 1);
                data.codigoEstablecimiento   = empresasecuencia.rows[0].establecimiento;
                data.codigoPuntoEmision      = empresasecuencia.rows[0].puntoemision;

                //logistica_despacho_guia inserto despues de generar la secuencia
                let numeroguia = data.codigoEstablecimiento + data.codigoPuntoEmision + data.secuenciagenerada;
                resul = await db
                .query(`INSERT INTO public.logistica_despacho_guia(
                        idlogisticadespacho, numeroguia, estado, generadosri,
                        estadosri, observacion, fechageneracionguia, idusuario, fecharegistro, contadorimpresion, cantidadremitida)
                        VALUES ($1, $2, 1, null, null, '', null, $3, now(), null, null) RETURNING id`,
                    [data.idlogisticadespacho,  numeroguia , data.idusuario ]) // .catch(console.log); SELECT SCOPE_IDENTITY() as id
                data.id = resul.rows[0].id; 
                
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }


    async createOrUpdateLogisticaDespachoGuia(data) {
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
                .query(`INSERT INTO public.logistica_despacho_guia(
                        idlogisticadespacho, numeroguia, estado, generadosri,
                        estadosri, observacion, fechageneracionguia, idusuario, fecharegistro, contadorimpresion, cantidadremitida)
                        VALUES ($1, $2, 1, null, null, '', null, $3, now(), null, null) RETURNING id`,
                    [data.idlogisticadespacho,  numeroguia , data.idusuario ]) // .catch(console.log); SELECT SCOPE_IDENTITY() as id
                data.id = resul.rows[0].id; 
                
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }


    async updateAutorizacionLogisticaDespachoGuia(data) {
        try {
            let resul;
            let numeroguia = data.codigoEstablecimiento + data.codigoPuntoEmision + data.secuencialComprobante;
            await db.query(`UPDATE logistica_despacho_guia set autorizacion = $2 , numeroguia = $3 , fechaautorizacion = $4 where id = $1`, [data.id , data.autorizacion , numeroguia , data.fechaautorizacion]);
            //await db.query(`SELECT * FROM tablaguia where id = $1`, [iddocumento]);
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
    async updateAnularLogisticaDespachoGuia(data) {
        try {
             
            await db.query(`UPDATE logistica_despacho_guia set idlogisticadespacho = null , estado = 0 where id = $1`, [data.idlogisticadespachoguia]);
            //await db.query(`SELECT * FROM tablaguia where id = $1`, [iddocumento]);
            //devuelvo el registro con los datos actualizados
            //let results = await db.query(`SELECT * FROM logistica_despacho_guia where id = $1`, [data.id]);
            return data;      
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }    
    }


    async getDatosEmpresa() {
        let results = await db.query(`SELECT * 
                                      FROM tm_empleado where estado = 1 and idcargoempleado = 3 order by apellido asc`)
                                      .catch(console.log);
        return results.rows;
    }

}

module.exports = logisticaDespachos;