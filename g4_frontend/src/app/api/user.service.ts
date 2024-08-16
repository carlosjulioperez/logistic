import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { Storage } from '@ionic/storage';
//import { Storage } from '@ionic/storage-angular';
import { Usuario } from 'src/app/model/Core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiweb:string = environment.apirest + 'coreusuario';
  usuario:Usuario = new Usuario();
  //public vistaActual:vistapermiso
  public token:any;
  public sn_conexion=false;
  private authSubject = new Subject<any>();

  constructor(private cliente:HttpClient, private storage: Storage) { 

  }

  publishAuth(data: any) {
    this.authSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.authSubject;
  }

  async getLogin(){
    //this.storage.clear()
    this.token = await this.storage.get('token');
    if(this.token == null) return false;
    this.usuario = await this.storage.get('user')
    return true;
  }

  async saveLogin(user:any, token:any){
    this.usuario = user
    this.token = token
    await this.storage.set('user', this.usuario)
    await this.storage.set('token', this.token)
  }

  deleteLogin(){
    this.postLogout()
    this.storage.remove('user')
    this.storage.remove('token')
    this.usuario = new Usuario() //null
    this.token = null
  }

  postLogin(objetox:any){
    return this.cliente.post(this.apiweb + '/login', objetox,
      {headers:{'Content-Type':'application/json'}}).toPromise();
  }

  getOpcionesMenubyIdUsuario(idusuario:any){
    return this.cliente.get(this.apiweb+'/opcionesmenubyidusuario/'+ idusuario,{headers:{'Content-Type':'application/json', 'Authorization': this.token}}).toPromise();
  }
 

  postUpdatePassword(objetox:any, token:any){
    return this.cliente.post(this.apiweb + '/updatepassword', objetox,
      {headers:{'Content-Type':'application/json', 'Authorization': token}}).toPromise();
  }

  postLogout(){
    return this.cliente.post(this.apiweb + '/logout', {},
      {headers:{'Content-Type':'application/json', 'Authorization': this.token}}).toPromise();
  }

  getVersion(){
    return this.cliente.get(this.apiweb+'/version',{headers:{'Content-Type':'application/json'}}).toPromise();
  }

}
