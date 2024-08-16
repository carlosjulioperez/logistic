import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class PlanificacionprogramaService {

  apiweb:string = environment.apirest + 'planificacionprograma';


  constructor(private cliente:HttpClient, public userService: UserService) { 

  }

  getAll(){
    return this.cliente.get(this.apiweb,{headers:{'Content-Type':'application/json' , 'Authorization': this.userService.token  }}).toPromise();
  }

  getProgramaByIdAguaje(idx:any){
    return this.cliente.get(this.apiweb+'/programabyidaguaje/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramaFechaDespachobyIdAguaje(idx:any){
    return this.cliente.get(this.apiweb+'/programafechadespachobyidaguaje/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramabyIdAguajeAndFechaDespacho(idx:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/programabyidaguajeandfechadespacho/'+ idx + '/' + fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramabyIdAguajeAndIdCliente(idaguaje:any , idcliente:any){
    return this.cliente.get(this.apiweb+'/programabyidaguajeandidcliente/'+ idaguaje + '/' +idcliente ,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramabyIdAguajeAndIdClienteAndFechaDespacho(idaguaje:any , idcliente:any , fechadespacho:any){
    return this.cliente.get(this.apiweb+'/programabyidaguajeandidclienteandfechadespacho/'+ idaguaje + '/' +idcliente + '/' + fechadespacho,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProgramaDetalleLogisticabyIdAguaje(idx:any){
    return this.cliente.get(this.apiweb+'/programadetallelogisticabyidaguaje/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  } 

  getPlanificacionprogramaByIdAguaje(idx:any){
    return this.cliente.get(this.apiweb+'/planificacionprogramabyidaguaje/'+ idx,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getTipoProceso(){
    return this.cliente.get(this.apiweb+'/tipoproceso/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getSociedad(){
    return this.cliente.get(this.apiweb+'/sociedad/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getSociedadById(idsociedad:any){
    return this.cliente.get(this.apiweb+'/sociedadbyid/'+ idsociedad,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProveedor(){
    return this.cliente.get(this.apiweb+'/proveedor/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProveedorPropiedad(){
    return this.cliente.get(this.apiweb+'/proveedorpropiedad/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProveedorByIdtipo(idproveedortipo:any){
    return this.cliente.get(this.apiweb+'/proveedorbyidtipo/' + idproveedortipo,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getProveedorCamaronByIdPropiedad(idproveedorpropiedad:any){
    return this.cliente.get(this.apiweb+'/proveedorcamaronbyidpropiedad/' + idproveedorpropiedad,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getComprador(){
    return this.cliente.get(this.apiweb+'/comprador/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getSector(){
    return this.cliente.get(this.apiweb+'/sector/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getSucursal(){
    return this.cliente.get(this.apiweb+'/sucursal/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }
  
  getTipoMetabisulfito(){
    return this.cliente.get(this.apiweb+'/tipometabisulfito/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getCampamento(){
    return this.cliente.get(this.apiweb+'/campamento/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getMetodoCosecha(){
    return this.cliente.get(this.apiweb+'/metodocosecha/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getPiscina(){
    return this.cliente.get(this.apiweb+'/piscina/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getClientes(){
    return this.cliente.get(this.apiweb+'/clientes/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getMuelle(){
    return this.cliente.get(this.apiweb+'/muelle/',{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  getEmpleadoByIdCargo(idcargoempleado:any){
    return this.cliente.get(this.apiweb+'/empleadobyidcargo/' + idcargoempleado,{headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  postUpdateDetalle(objetox:any){
    return this.cliente.post(this.apiweb+'/planificaciondetalleupdate', objetox, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  postUpdateCabecera(objetox:any){
    return this.cliente.post(this.apiweb+'/planificacioncabeceraupdate', objetox, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise();
  }

  async post(planificacionprograma:any){    
    return this.cliente.post(this.apiweb + '/', planificacionprograma, {headers:{'Content-Type':'application/json', 'Authorization': this.userService.token}}).toPromise()   
  }

}
