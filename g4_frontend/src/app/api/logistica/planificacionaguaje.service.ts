import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class PlanificacionaguajeService {

  apiweb:string = environment.apirest + 'planificacionaguaje';


  constructor(private cliente:HttpClient, public userService: UserService) { 

  }

  getAll(){
    return this.cliente.get(this.apiweb,{headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  async post(planificacionAguaje:any){    
    return this.cliente.post(this.apiweb + '/', planificacionAguaje, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
     
  }
}
