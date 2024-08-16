import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { UserService } from '../user.service';
@Injectable({
  providedIn: 'root'
})
export class LogisticadespachoService {

  
  apiweb:string     = environment.apirest + 'logisticadespacho';
  apiwebGuia:string = environment.apirestguia + 'guia';

  constructor(private cliente:HttpClient, public userService: UserService) { 

  }

  getProgramaDetalleLogisticabyIdAguaje(id:any){
    return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguaje/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramaDetalleLogisticabyIdAguajeAndFechaDespacho(id:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguajeandfechadespacho/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getInformacionMovilesbyIdPlanificacionDetalle(id:any){
    return this.cliente.get(this.apiweb+'/informacionmovilesbyidplanificaciondetalle/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramaDetalleLogisticabyIdAguajeExport(id:any){
    return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguajeexport/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramaDetalleLogisticabyIdAguajeAndFechaDespachoExport(id:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguajeandfechadespachoexport/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramaDetalleLogisticaMonitorbyIdAguajeExport(id:any){
    return this.cliente.get(this.apiweb+'/programadetallelogisticamonitorbyidaguajeexport/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramaDetalleLogisticaMonitorbyIdAguajeAndFechaDespachoExport(id:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/programadetallelogisticamonitorbyidaguajeandfechadespachoexport/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  
  getImpresionDocumentosbyIdAguaje(id:any){
    return this.cliente.get(this.apiweb+'/impresiondocumentosbyidaguaje/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getImpresionDocumentosbyIdAguajeAndFechaDespacho(id:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/impresiondocumentosbyidaguajeandfechadespacho/'+ id + '/'+fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getTransporte(){
    return this.cliente.get(this.apiweb+'/transporte/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getBiologo(){
    return this.cliente.get(this.apiweb+'/biologo/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }
  
  getBinesDisponibles(){
    return this.cliente.get(this.apiweb+'/binesdisponibles/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  postUpdateDetalle(objeto:any){
    return this.cliente.post(this.apiweb+'/logisticadespachoupdate', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  postUpdateMaterialDetalle(objeto:any){
    return this.cliente.post(this.apiweb+'/logisticadespachomaterialupdate', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  async postCreateLogisticaDespachoEmpty(objeto:any){    
    return this.cliente.post(this.apiweb + '/logisticadespachocreateempty', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
  }

  getFile(iddocumento:any, tipo:1|2 , idsociedad:any){
    return this.cliente.get(this.apiweb  +'/download/'+iddocumento+ '/'+tipo + '/'+ idsociedad
      , {headers: {'Content-Type':'application/json','Authorization': this.userService.token}, responseType:'blob' }).toPromise();
  }

  postGeneraLogisticaDespachoGuia(objeto:any){    
    return this.cliente.post(this.apiweb + '/generalogisticadespachoguia', objeto, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

  postGeneraLogisticaDespachoGuiaDocumento(objeto:any){    
    return this.cliente.post(this.apiwebGuia + '/guia_electronica', objeto, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

  postGeneraLogisticaDespachoGuiaDocumentoPdf(objeto:any){    
    return this.cliente.post(this.apiwebGuia + '/guia_electronica_pdf', objeto, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

  postUpdateAutorizacionLogisticaDespachoGuia(objeto:any){    
    return this.cliente.post(this.apiweb + '/updateautorizacionlogisticadespachoguia', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
  }

  postUpdateAnularLogisticaDespachoGuia(objeto:any){    
    return this.cliente.post(this.apiweb + '/updateanularlogisticadespachoguia', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
  }

  getUpdateAnularLogisticaDespachoGuiaDocumento(rutaextensionarchivoorigen:any , rutaextensionarchivodestino:any ){    
    return this.cliente.post(this.apiwebGuia + '/anularguiaelectronica/'+rutaextensionarchivoorigen+ '/'+rutaextensionarchivodestino, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }



}
