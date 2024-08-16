import { Component, Injector , OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { planificacionProgramaCabecera, planificacionProgramaDetalle } from 'src/app/model/PlanificacionPrograma';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ButtonEditComponent } from 'src/app/components/button-edit/button-edit.component';
import { ButtonDeleteComponent } from 'src/app/components/button-delete/button-delete.component';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { PlanificacionaguajeService } from 'src/app/api/logistica/planificacionaguaje.service';
import { PlanificacionprogramaService } from 'src/app/api/logistica/planificacionprograma.service';
import { LogisticadespachoService } from 'src/app/api/logistica/logisticadespacho.service';
import { GestiondespachoPage } from './gestiondespacho/gestiondespacho.page';
import { SearchPage } from 'src/app/search/search.page';
import * as XLSX from 'xlsx';
import { VisorPage } from '../../reporte/visor/visor.page';

@Component({
  selector: 'app-logisticadespacho',
  templateUrl: './logisticadespacho.page.html',
  styleUrls: ['./logisticadespacho.page.scss'],
})
export class LogisticadespachoPage implements OnInit {

  listAguaje:any                  = [];
  listDetallePrograma:any         = [];
  loading:any
  objeto:planificacionProgramaCabecera;
 
   totalcabeceralibrasprogramadas:Number = 0;
   totalcabecerabines:Number  = 0;
   totalcabeceraconica:Number = 0;
   totalcabeceracalada:Number = 0;
   totalcabecerahielo:Number  = 0;
   totalcabecerameta:Number   = 0;
   totalcabecerasal:Number    = 0;
   totalcabeceralibrasprogramadasmovil:Number = 0;

   fechadespachofiltro:any    = null;
   listafechadespacho:any  = [];
  

  constructor(public loadingController: LoadingController, public modalCtrl: ModalController ,
    public toastController: ToastController, public alertController: AlertController,
    private servicePlanificacionAguaje: PlanificacionaguajeService , 
    private servicePlanificacionPrograma: PlanificacionprogramaService , 
    private serviceLogisticadespacho: LogisticadespachoService) {

    this.objeto         = new planificacionProgramaCabecera();
  }

  ngOnInit() {
    this.getDatos();
  }

  async getDatos(){ 
    try {
      await this.presentLoading();
       
      await this.servicePlanificacionAguaje.getAll().then((respuesta:any) => {
        console.log('lista aguaje' , respuesta)
        this.listAguaje=respuesta
        this.closeLoading();///aki demas
      }).catch((error:any) => {
        console.log(error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      }) 

    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    } finally {
      this.closeLoading() 
    }
  }


  async onAguajeSelected(){
    //limpiar objeto detalle 
    //this.objetodetalle  = new planificacionProgramaDetalle();
    //consultar datos cabecera y detalle 

    /*
    await this.servicePlanificacionPrograma.getProgramaDetalleLogisticabyIdAguaje(this.objeto.idaguaje).then((respuesta:any) => {
      console.log('list datos' , respuesta)
      if(respuesta.length > 0){
        this.objeto = respuesta[0];
        this.listDetallePrograma = respuesta[0].detalle;
      }else{
        console.log('sin datos'  )
      }     
    }) */

    this.totalcabeceralibrasprogramadas = 0;
    this.totalcabecerabines  = 0;
    this.totalcabeceraconica = 0;
    this.totalcabeceracalada = 0;
    this.totalcabecerahielo  = 0;
    this.totalcabecerameta   = 0;
    this.totalcabecerasal    = 0;
    this.totalcabeceralibrasprogramadasmovil = 0;
    

    /* //Comentada por ahora
    await this.serviceLogisticadespacho.getProgramaDetalleLogisticabyIdAguaje(this.objeto.idaguaje).then((respuesta:any) => {
      console.log('list datos' , respuesta)
      this.listDetallePrograma = respuesta;     
      for(let item of  this.listDetallePrograma ){
        //console.log('item.cantidadprogramada' , item.cantidadprogramada )
        //if(item.estado === 1){
          this.totalcabeceralibrasprogramadas =  item.totalcabeceralibrasprogramadas;   
          this.totalcabecerabines =  item.totalcabecerabines;  
          this.totalcabeceraconica =  item.totalcabeceraconica;  
          this.totalcabeceracalada =  item.totalcabeceracalada;  
          this.totalcabecerahielo =  item.totalcabecerahielo;  
          this.totalcabecerameta =  item.totalcabecerameta;  
          this.totalcabecerasal =  item.totalcabecerasal;  
          this.totalcabeceralibrasprogramadasmovil =  item.totalcabeceralibrasprogramadasmovil;  
        //}  
      }

    })*/

    try {

        await this.presentLoading('Consultando Fechas...');

        //cargo los datos de las fechas de despacho
        this.fechadespachofiltro    =  null;
        await this.servicePlanificacionPrograma.getProgramaFechaDespachobyIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
          console.log('list fecha despacho (<any>respuesta)' , (<any>respuesta))
          this.listafechadespacho = (<any>respuesta);
          this.closeLoading();
        }).catch((error:any) => {
          console.log(error)
          this.closeLoading();
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        })
      } catch (error) {
        //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
        console.log('error es ',error)
        this.showMessage(error, "middle", "danger",1000)
      } finally {        
        this.closeLoading() 
      }   

  }


  async buscarFechaDespacho(){  
    if(this.objeto.idaguaje == 0){
      this.showMessage("Debe seleccionar un Aguaje", "middle", "danger");
      return;
    }

    try {

      //await this.presentLoading();
  
      await this.mostrarFormularioBusqueda('Lista Fechas Despachos', this.listafechadespacho , ["fechadespacho"]).then(async data => {
        if(!!data){
          console.log('(<any>data).id' , (<any>data).id)
          //this.idprogramaciondetalle  = (<any>data).id
          //this.fechadespachofiltro    =   '['+(<any>data).fechadespacho.slice(0,10)+']';
          this.fechadespachofiltro    =   (<any>data).fechadespacho.slice(0,10);
          //this.fechadespachofiltro    =(<any>data).fechadespacho;

          this.totalcabeceralibrasprogramadas = 0;
          this.totalcabecerabines  = 0;
          this.totalcabeceraconica = 0;
          this.totalcabeceracalada = 0;
          this.totalcabecerahielo  = 0;
          this.totalcabecerameta   = 0;
          this.totalcabecerasal    = 0;
          this.totalcabeceralibrasprogramadasmovil = 0;

          try{
            await this.presentLoading('Consultando Programacion...');
            await this.serviceLogisticadespacho.getProgramaDetalleLogisticabyIdAguajeAndFechaDespacho(this.objeto.idaguaje , (<any>data).fechadespacho.slice(0,10) ).then((respuesta:any) => {
              console.log('list datos' , respuesta)
              this.listDetallePrograma = respuesta;    
              
              for(let item of  this.listDetallePrograma ){
                //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                //if(item.estado === 1){
                  this.totalcabeceralibrasprogramadas =  item.totalcabeceralibrasprogramadas;   
                  this.totalcabecerabines =  item.totalcabecerabines;  
                  this.totalcabeceraconica =  item.totalcabeceraconica;  
                  this.totalcabeceracalada =  item.totalcabeceracalada;  
                  this.totalcabecerahielo =  item.totalcabecerahielo;  
                  this.totalcabecerameta =  item.totalcabecerameta;  
                  this.totalcabecerasal =  item.totalcabecerasal;  
                  this.totalcabeceralibrasprogramadasmovil =  item.totalcabeceralibrasprogramadasmovil;  
                //}  
              }
              this.closeLoading();
            }).catch((error:any) => {
              console.log(error)
              this.closeLoading();
              this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
            }) 
          } catch (error) {
            //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
            console.log('error es ',error)
            this.showMessage(error, "middle", "danger",1000)
          } finally {        
            this.closeLoading() 
          }   
           
        }
      })

    } catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally { 
      // this.closeLoading() 
    }  
  }  


  async nuevo(){

  }

  async ediacionItem(item:any){
      console.log('item ->',item)

      const modal = await this.modalCtrl.create({
        component: GestiondespachoPage, backdropDismiss:false, cssClass:'modal-90', //cssClass:'modal-50-detalle',
        componentProps: { id: item.id , objetoitem: item , listDetallePrograma: this.listDetallePrograma}
      });
      modal.onDidDismiss().then(data => {
         this.getDatos();
         //this.closeLoading();
         //this.onAguajeSelected();
         //this.closeLoading() ;
         this.cargarDatos();
      })
      return await modal.present();
  }


  async cargarDatos(){
    await this.serviceLogisticadespacho.getProgramaDetalleLogisticabyIdAguajeAndFechaDespacho(this.objeto.idaguaje , this.fechadespachofiltro ).then((respuesta:any) => {
      console.log('list datos' , respuesta)
      this.listDetallePrograma = respuesta;    
      
      for(let item of  this.listDetallePrograma ){
        //console.log('item.cantidadprogramada' , item.cantidadprogramada )
        //if(item.estado === 1){
          this.totalcabeceralibrasprogramadas =  item.totalcabeceralibrasprogramadas;   
          this.totalcabecerabines =  item.totalcabecerabines;  
          this.totalcabeceraconica =  item.totalcabeceraconica;  
          this.totalcabeceracalada =  item.totalcabeceracalada;  
          this.totalcabecerahielo =  item.totalcabecerahielo;  
          this.totalcabecerameta =  item.totalcabecerameta;  
          this.totalcabecerasal =  item.totalcabecerasal;  
          this.totalcabeceralibrasprogramadasmovil =  item.totalcabeceralibrasprogramadasmovil;  
        //}  
      }
       
    })
  }


  async guardar(){

  }


  async imprimir(){
    const modal = await this.modalCtrl.create({
      component: VisorPage, backdropDismiss:false, cssClass:'modal-pdf', //modal-80
      componentProps: { reporte: "home/metric_erp/reportes", titulo:"ReporteDemo",
        parametros: {ID:1} 
      }
    });
    modal.onDidDismiss().then(data => {
      
    })
    return await modal.present();
  }

  async excelExportar(){
  
    if(this.objeto.idaguaje == 0) {
      this.showMessage('Seleccione un Numero de Aguaje', "middle", "danger")
      return;
    }

    /*
    if( this.listDetallePrograma.length == 0) {
      this.showMessage('No existe informacion asociada al Aguaje seleccionado', "middle", "danger")
      return;
    }*/

    let listainformacion :any         = [];

    try {

      await this.presentLoading('Procesando Informacion...');
      //let sociedad:any = null;

      if(this.fechadespachofiltro == null){
          await this.serviceLogisticadespacho.getProgramaDetalleLogisticabyIdAguajeExport(this.objeto.idaguaje).then(async (respuesta:any) => {
            console.log('info' , respuesta)
            listainformacion = <any>respuesta;
            this.closeLoading();
          }).catch((error:any) => {
            console.log(error)
            this.closeLoading();
            this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
          })
      }else{
          await this.serviceLogisticadespacho.getProgramaDetalleLogisticabyIdAguajeAndFechaDespachoExport(this.objeto.idaguaje, this.fechadespachofiltro).then(async (respuesta:any) => {
            console.log('info con fecha' , respuesta)
            listainformacion = <any>respuesta;
            this.closeLoading();
          }).catch((error:any) => {
            console.log(error)
            this.closeLoading();
            this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
          })
      }

    } catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally {       
      this.closeLoading() 
    }  

     //+'_'+new Date() 
     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listainformacion);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'ListaDespachos');
     XLSX.writeFile(wb, 'ListaDespachos'+ '.xlsx');

  }

  currencyFormatterLabel( params:any ) {  //(<any>respuesta))
    //let dato = params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    let dato = Number(params).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    //console.log(params.value)
    //console.log(dato)
    let resultado = params == null ? '' : dato;
    return resultado+''
  }



  async presentLoading(message='Espere un momento') {
    this.loading = await this.loadingController.create({
      message: message
    });
    await this.loading.present();
  }

  async closeLoading(){
    await this.loading.dismiss();
  }

  async showMessage(messagex:any, positionx:any="bottom",  colorx="primary" , durationx=2000){
    const toast = await this.toastController.create({ 
      message: messagex,
      position: positionx, 
      duration: durationx,
      color:colorx,
    })
    toast.present();
  }

  async presentAlertConfirm(titulox:any, mensajex:any) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: titulox,
        message: mensajex,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancelar',
            handler: (blah:any) => {
              return resolve(false);
            }
          }, {
            text: 'Aceptar',
            handler: (data:any) => {
              return resolve(true);
            }
          }
        ]
      });
  
      await alert.present();
    });
  }


  
  mostrarFormularioBusqueda(titulo:any, datos:any, parametros:any, filtrox='', clase=undefined, multiple=false){
    return new Promise( async (resolve, reject) => {
      const modal = await this.modalCtrl.create({
        component: SearchPage, backdropDismiss:false, cssClass:clase,
        componentProps: {titulo:titulo, datos: JSON.parse(JSON.stringify(datos)), campos:parametros, filtro: filtrox, multiple: multiple}
      });
      modal.onDidDismiss().then(resp => {
        if(resp.data == null) resolve(null)
        else resolve(resp.data.result)
      })
      await modal.present();
    })
    
  }


}
