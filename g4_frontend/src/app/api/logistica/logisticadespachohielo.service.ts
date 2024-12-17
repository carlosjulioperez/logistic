import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { UserService } from '../user.service';
@Injectable({
  providedIn: 'root'
})
export class LogisticadespachohieloService {

  
  apiweb:string     = environment.apirest + 'logisticadespachohielo';
  apiwebGuia:string = environment.apirestguia + 'guia';

  constructor(private cliente:HttpClient, public userService: UserService) { 
  }

  getImpresionDocumentosbyIdAguajeAndFechaDespacho(id:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/impresiondocumentosbyidaguajeandfechadespacho/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getTransporte(){
    return this.cliente.get(this.apiweb+'/transporte/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }
 
  deleteLogisticaDespachoHieloDetalle(objeto:any){
    return this.cliente.post(this.apiweb+'/logisticadespachohielodetalledelete', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }
  
  deleteLogisticaDespachoHieloCabecera(objeto:any){
    return this.cliente.post(this.apiweb+'/logisticadespachohielocabeceradelete', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  postUpdateDetalle(objeto:any){
    return this.cliente.post(this.apiweb+'/logisticadespachohielodetalleupdate', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  async postCreateLogisticaDespachoHieloEmpty(objeto:any){    
    console.log(objeto);
    return this.cliente.post(this.apiweb + '/logisticadespachohielocreateempty', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
  }

  getFile(iddocumento:any, tipo:1|2 , idsociedad:any){
    return this.cliente.get(this.apiweb  +'/download/'+iddocumento+ '/'+tipo + '/'+ idsociedad
      , {headers: {'Content-Type':'application/json','Authorization': this.userService.token}, responseType:'blob' }).toPromise();
  }

  postGeneraLogisticaDespachoHieloGuia(objeto:any){    
    return this.cliente.post(this.apiweb + '/generalogisticadespachohieloguia', objeto, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

  postGeneraLogisticaDespachoHieloGuiaDocumento(objeto:any){    //TODO
    return this.cliente.post(this.apiwebGuia + '/guia_electronica', objeto, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

  postGeneraLogisticaDespachoHieloGuiaDocumentoPdf(objeto:any){    
    return this.cliente.post(this.apiwebGuia + '/guia_electronica_pdf', objeto, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

  postUpdateAutorizacionLogisticaDespachoHieloGuia(objeto:any){    
    return this.cliente.post(this.apiweb + '/updateautorizacionlogisticadespachohieloguia', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
  }

  postUpdateAnularLogisticaDespachoHieloGuia(objeto:any){    
    return this.cliente.post(this.apiweb + '/updateanularlogisticadespachohieloguia', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
  }

  getUpdateAnularLogisticaDespachoHieloGuiaDocumento(rutaextensionarchivoorigen:any , rutaextensionarchivodestino:any ){    
    return this.cliente.post(this.apiwebGuia + '/anularguiaelectronica/'+rutaextensionarchivoorigen+ '/'+rutaextensionarchivodestino, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

}
