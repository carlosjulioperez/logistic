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

  // getProgramaDetalleLogisticabyIdAguaje(id:any){
  //   return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguaje/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  // getProgramaDetalleLogisticabyIdAguajeAndFechaDespacho(id:any , fechadespacho:any){
  //   return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguajeandfechadespacho/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  // getInformacionMovilesbyIdPlanificacionDetalle(id:any){
  //   return this.cliente.get(this.apiweb+'/informacionmovilesbyidplanificaciondetalle/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  // getProgramaDetalleLogisticabyIdAguajeExport(id:any){
  //   return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguajeexport/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  // getProgramaDetalleLogisticabyIdAguajeAndFechaDespachoExport(id:any , fechadespacho:any){
  //   return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguajeandfechadespachoexport/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  // getProgramaDetalleLogisticaMonitorbyIdAguajeExport(id:any){
  //   return this.cliente.get(this.apiweb+'/programadetallelogisticamonitorbyidaguajeexport/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  // getProgramaDetalleLogisticaMonitorbyIdAguajeAndFechaDespachoExport(id:any , fechadespacho:any){
  //   return this.cliente.get(this.apiweb+'/programadetallelogisticamonitorbyidaguajeandfechadespachoexport/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  
  // getImpresionDocumentosbyIdAguaje(id:any){
  //   return this.cliente.get(this.apiweb+'/impresiondocumentosbyidaguaje/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  getImpresionDocumentosbyIdAguajeAndFechaDespacho(id:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/impresiondocumentosbyidaguajeandfechadespacho/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  // getTransporte(){
  //   return this.cliente.get(this.apiweb+'/transporte/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  // getBiologo(){
  //   return this.cliente.get(this.apiweb+'/biologo/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }
  
  // getBinesDisponibles(){
  //   return this.cliente.get(this.apiweb+'/binesdisponibles/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

  getTransporte(objeto:any){
    return this.cliente.post(this.apiweb+'/gettransporte', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  // postUpdateMaterialDetalle(objeto:any){
  //   return this.cliente.post(this.apiweb+'/logisticadespachomaterialupdate', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  // }

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
