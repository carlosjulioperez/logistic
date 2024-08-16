export class guiaElectronica{

    id:number;
    idlogisticadespacho:number;
    idusuario:number;
    razonSocial:string;
    nombreComercial:string;
    ruc:string;
    codigoEstablecimiento:string;
    codigoPuntoEmision:string;
    secuencialComprobante:string; //con todos los ceros a la izquierda
    secuenciagenerada:number;
    direccionMatriz:string;
    ambiente:string;
    emision:string;
    direccionEstablecimiento:string;
    fechaEmision:string;
    direccionPartida:string;
    razonSocialTransportista:string;
    tipoIdentificacionTransportista:string;
    rucTransportista:string;
    obligadoContabilidad:string;
    contribuyenteEspecial:string;
    placas:string;
    identificacionDestinatario:string;
    razonSocialDestinatario:string;
    dirDestinatario:string;
    motivoTraslado:string;
    fechaEmisionDocSustento:string;
    //numDocSustento:string;
    //numAutDocSustento:string;
    telefono:string;
    mail:string;
    direccionCarpeta:string;
    ubicacionFirma:string;
    claveFirma:string;
    horallegada:string;
    librasprogramadas:string;
    librascarro:string;
    muelle:string;
    piscina:string;
    autorizacion:string; // este numero sirve para recuperar el archivo , este lo llena el servicio
    detalle:guiaDetalle[]
    idsociedad:number;
    rutalogo:string;
    ruta:string;
    sellos:string;
    fechafintransporte:string;
    ordencompra:string;
    cliente:string;
    base:string;//base de operacion
    direccionconsultapdf:string;
    fechaautorizacion:string;
    //piloto:string;
    //copiloto:string;
    binescarro:string;

    constructor(){
        this.id = 0;
        this.idlogisticadespacho = 0;
        this.idusuario = 0;
        this.razonSocial = '';
        this.nombreComercial = '';
        this.ruc = '';
        this.codigoEstablecimiento = '';
        this.codigoPuntoEmision = '';
        this.secuencialComprobante = '';
        this.secuenciagenerada = 0;
        this.direccionMatriz = '';
        this.ambiente = '';
        this.emision = '';
        this.direccionEstablecimiento = '';
        this.fechaEmision = '';
        this.direccionPartida = '';
        this.razonSocialTransportista = '';
        this.tipoIdentificacionTransportista = '';
        this.rucTransportista = '';
        this.obligadoContabilidad = '';
        this.contribuyenteEspecial = '';
        this.placas = '';
        this.identificacionDestinatario = '';
        this.razonSocialDestinatario = '';
        this.dirDestinatario = '';
        this.motivoTraslado = '';
        this.fechaEmisionDocSustento = '';
        //this.numDocSustento = '';
        //this.numAutDocSustento = '';
        this.telefono = '';
        this.mail = '';
        this.direccionCarpeta = '';
        this.ubicacionFirma = '';
        this.claveFirma = '';
        this.horallegada= '';
        this.librasprogramadas= '';
        this.librascarro= '';
        this.muelle= '';
        this.piscina= '';
        this.autorizacion = '';
        this.detalle = [];
        this.idsociedad = 0;
        this.rutalogo = '';
        this.ruta = '';
        this.sellos = '';
        this.fechafintransporte = '';
        this.ordencompra = '';
        this.cliente = '';
        this.base = '';
        this.direccionconsultapdf = '';
        this.fechaautorizacion = '';
        //this.piloto='';
        //this.copiloto='';
        this.binescarro='';
    }    
}


export class guiaDetalle{

    codigoInterno:string;
    codigoAdicional:string;
    descripcion:string;
    cantidad:string;


    constructor(){
        this.codigoInterno = '';
        this.codigoAdicional = '';
        this.descripcion = '';
        this.cantidad = '';
    }

        
}  