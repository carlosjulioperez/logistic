import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { UserService } from '../user.service';


@Injectable({
  providedIn: 'root'
})
export class CoregrupoService {

  apiweb:string = environment.apirest + 'coregrupo';


  constructor(private cliente:HttpClient, private userService: UserService) { 

  }


  getAll(){
    return this.cliente.get(this.apiweb,{headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  getObjectById(idx:any){
    return this.cliente.get(this.apiweb+'/single/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  post(objeto:any){
    return this.cliente.post(this.apiweb, objeto, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

 
}
