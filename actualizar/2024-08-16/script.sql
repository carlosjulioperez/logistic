INSERT INTO core_plantilla_tm VALUES (11, 'TIPO META', 'TM_TIPO_METABISULFITO', 1, '2024-07-06 00:00:00');

--SELECT idcoreplantillatmdetalle, idcoreplantillatm, nombrecampo, idtipocampo, tablareferencia, estado, incluircrud, campoquery, etiquetaforma, etiquetagrid, mostrarcrud, obligatorio, valordefecto
select *
FROM public.core_plantilla_tm_detalle
WHERE idcoreplantillatm=5 order by idcoreplantillatmdetalle;

-- DROP TABLE public.tm_tipo_metabisulfito;
CREATE TABLE tm_tipo_metabisulfito (
	id SERIAL PRIMARY KEY,
	descripcion varchar,
	estado smallint,
	idusuario varchar,
	fecharegistro timestamp,
	mostrarcrud bool,
	mostrarview bool
);

INSERT INTO tm_tipo_metabisulfito (descripcion, estado, fecharegistro)
values
	('TIPO 1', 1, '2024-07-07 00:00:00'),
	('TIPO 2', 1, '2024-07-07 00:00:00'),
	('TIPO 3', 1, '2024-07-07 00:00:00');

INSERT INTO core_plantilla_tm_detalle
(idcoreplantillatm, nombrecampo, idtipocampo, tablareferencia, estado, incluircrud, campoquery, etiquetaforma, etiquetagrid, mostrarcrud, obligatorio, valordefecto)
VALUES
    (11, 'id',            1, '',             1, true, '', 'Id Tipo',        'id',             true,  true, ''),
    (11, 'descripcion',   2, '',             1, true, '', 'Descripción',    'Descripción',    true,  true, ''),
    (11, 'estado',        3, '',             1, true, '', 'Estado',         'Estado',         false, true, '1'),
    (11, 'idusuario',     9, 'core_usuario', 1, true, '', 'Usuario',        'Usuario',        false, true, ''),
    (11, 'fecharegistro', 8, '',             1, true, '', 'Fecha Registro', 'Fecha Registro', false, true, 'now()'),
    (11, 'mostrarcrud',   5, '',             1, true, '', 'Mostrar',        'Mostrar',        false, true, ''),
    (11, 'mostrarview',   5, '',             1, true, '', 'Ver',            'Ver',            false, true, '');

ALTER TABLE logistica_despacho ADD COLUMN idtipometabisulfito int4;