import { Injectable } from '@angular/core';
import { HttpClient, HttpParams }    from '@angular/common/http';
import { environment} from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class VisorService {

  apiwebGuia:string = environment.apirestguia + 'guia';

  constructor(private cliente:HttpClient) { 

  }

  postReporteDemo(objeto:any){    
    return this.cliente.post(this.apiwebGuia + '/reportedemo', objeto, {headers:{'Content-Type':'application/json'}}).toPromise()   
  }

  getReporteJasperPdf(nombrereportejasper:any, parametros=null, formato="html"){
    return this.cliente.post(this.apiwebGuia+'/reportepdf' , {reportejasper: nombrereportejasper , parametros:parametros},
      { responseType: 'blob',headers:{'Content-Type':'application/json' } }).toPromise();
  }

  getReporteJasperExcel(nombrereportejasper:any, parametros=null, formato="html"){
    return this.cliente.post(this.apiwebGuia+'/reporteexcel' , {reportejasper: nombrereportejasper , parametros:parametros},
      { responseType: 'blob',headers:{'Content-Type':'application/json' } }).toPromise();
  }

  getReporteJasperExcelDemo(url:any, parametros=null, formato="html"){
    return this.cliente.get(this.apiwebGuia+'/reporteexceldemo',
      { responseType: 'blob',headers:{'Content-Type':'application/json' } }).toPromise();
  }

  getReporteJasper(url:any, parametros=null, formato="html"){
    return this.cliente.post(this.apiwebGuia+'/reportedemo', {id:1, path: url, formato:formato, parametros:parametros},
      { responseType: 'blob',headers:{'Content-Type':'application/json' } }).toPromise();
  }


/*  getFile(iddocumento:any, tipo:1|2 , idsociedad:any){
    return this.cliente.get(this.apiweb  +'/download/'+iddocumento+ '/'+tipo + '/'+ idsociedad
      , {headers: {'Content-Type':'application/json','Authorization': this.userService.token}, responseType:'blob' }).toPromise();
}*/



}
