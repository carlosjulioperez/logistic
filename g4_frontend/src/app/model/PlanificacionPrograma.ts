 

export class planificacionProgramaCabecera{
 
    id:number;
    fechadespacho:string;
    idproveedor:number; 
    idcomprador:number; 
    fecharegistro:string; 
    idusuario:number; 
    estado:number;
    idtipoproceso:number;
    idaguaje:number;
    usuario:string; 
    idproveedorpropiedad:number;
    detalle:planificacionProgramaDetalle[]
    idstatus:number;
    idcliente:number;
    objetodetalle:planificacionProgramaDetalle
    aguaje:string;
    cliente:string;
    proveedor:string;
    librasaguaje:number; //solo de consulta
    quimico:boolean;
   

    constructor(){
        this.id = 0;
        this.fechadespacho  =  (new Date()).toISOString(); // '1995-12-15T13:47:20.789';  //new Date(); // = ''; // toISOString
        this.idproveedor = 0;  
        this.idcomprador = 0;
        this.fecharegistro = '';
        this.idusuario = 0;
        this.estado = 1;
        this.idtipoproceso = 0;
        this.idaguaje = 0;
        this.usuario = '';
        this.idproveedorpropiedad = 0;
        this.idstatus = 0;
        this.idcliente = 0;
        this.detalle=[];
        this.objetodetalle = new planificacionProgramaDetalle()
        this.aguaje = '';
        this.cliente  = '';
        this.proveedor = '';
        this.librasaguaje = 0;
        this.quimico = false;
         
    }   

}


export class planificacionProgramaDetalle{

    id:number;
    idprogramapesca:number;
    idsector:number;
    idcampamento:number;
    idpiscina:number;
    cantidadprogramada:number;
    idcliente:number;
    cantidadconfirmada:number;
    //idviatransporte
    //fecharegistropesca
    fechaconfirmacionpesca:string;
    fechamaterialescampo:string;
    idusuarioprogramacion:number;
    idusuarioconfirmacion:number;
    cantidadtransporteterrestre:number;
    idtipotransporte:number;
    gramaje:number;
    cantidadtransportemaritimo:number;
    observacioncompras:string;
    numeropuerta:number;
    idmetodocosecha:number;
    tpe:string;
    estado:number;
    fechaarriboplanta:string;
    sector:string;
    piscina:string;
    idsociedad: number;
    sociedad:string;

    constructor(){
        this.id = 0;
        this.idprogramapesca = 0;
        this.idsector = 0;
        this.idcampamento = 0;
        this.idpiscina = 0;
        this.cantidadprogramada = 0;
        this.idcliente = 0;
        this.cantidadconfirmada = 0;
        this.fechaconfirmacionpesca = (new Date()).toISOString();
        this.fechamaterialescampo = (new Date()).toISOString();
        this.idusuarioprogramacion = 0;
        this.idusuarioconfirmacion = 0;
        this.cantidadtransporteterrestre = 0;
        this.idtipotransporte = 0;
        this.gramaje = 0;
        this.cantidadtransportemaritimo = 0;
        this.observacioncompras = '';
        this.numeropuerta = 0;
        this.idmetodocosecha = 0;
        this.tpe = (new Date()).toISOString();
        this.estado = 1;
        this.fechaarriboplanta = (new Date()).toISOString();
        this.sector = '';
        this.piscina = '';
        this.idsociedad = 0;
        this.sociedad = '';

    }    

}