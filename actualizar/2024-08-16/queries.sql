-- 32, '2024-05-01'
SELECT d.id, d.idprogramapesca, d.idsector, sp.descripcion sector, d.idcampamento, camp.descripcion campamento,
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
                    where c.idaguaje = $1 and c.fechadespacho = $2 and c.estado = 1 and d.estado = 1 order by d.id asc

select * from logistica_despacho ld where idlogisticadespacho = 3658;                   
                    
--idplanificaciondetalle: '1070'
select ld.idlogisticadespacho id , ld.idplanificaciondetalle , 
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
where ld.idplanificaciondetalle = $3 and ld.estado = 1 order by ld.idlogisticadespacho asc
