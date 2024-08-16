import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  apiweb:string = environment.apirest + 'home';


  constructor(private cliente:HttpClient, public userService: UserService) { 

  }

  getAll(){
    return this.cliente.get(this.apiweb,{headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  getEProgramaByIdAguaje(idx:any){
    return this.cliente.get(this.apiweb+'/eprogramabyidaguaje/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getEProgramaByIdAguajeTabla(idx:any){
    return this.cliente.get(this.apiweb+'/eprogramabyidaguajetabla/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  async post(planificacionAguaje:any){    
    return this.cliente.post(this.apiweb + '/', planificacionAguaje, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
     
  }

  getHieleras(idaguaje:any){
    return this.cliente.get(this.apiweb + '/hieleras/' + idaguaje, {headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  getPuertos(idaguaje:any){
    return this.cliente.get(this.apiweb + '/puertos/' + idaguaje, {headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  getClientes(idaguaje:any){
    return this.cliente.get(this.apiweb + '/clientes/' + idaguaje, {headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  getProveedores(idaguaje:any){
    return this.cliente.get(this.apiweb + '/proveedores/' + idaguaje, {headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }
}
