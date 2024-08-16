import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class CoreplantillaService {

  apiweb:string = environment.apirest + 'coreplantilla';


  constructor(private cliente:HttpClient, private userService: UserService) { 

  }

  getAll(){
    return this.cliente.get(this.apiweb,{headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  getPlantillaTmDetalleByIdCab(id:any){
    return this.cliente.get(this.apiweb+'/plantilladetallebyidcab/'+ id,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getDatosTablaMaestraById(id:any , columnasupdateselect:any , tabla:any , idplantilla:any ){
    return this.cliente.get(this.apiweb+'/datosmaestrosbyid/'+ id +'/'+columnasupdateselect +'/'+tabla +'/' +idplantilla ,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getObjectById(idx:any){
    return this.cliente.get(this.apiweb+'/single/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getUpdateEstadoTablaMaestra(tablanombre:any , idx:any , estado:any){
    return this.cliente.get(this.apiweb+'/updatetablamaestraestado/'+ tablanombre +'/' + idx  +'/' + estado ,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  postDetalleMaestro(objeto:any){
    return this.cliente.post(this.apiweb+'/savedetallemaestro', objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  post(objeto:any){
    return this.cliente.post(this.apiweb, objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }




}
