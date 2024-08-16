import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, ModalController, ToastController, AlertController } from '@ionic/angular';
import { formatISO } from 'date-fns';
import { LogisticadespachoService } from 'src/app/api/logistica/logisticadespacho.service';
import { PlanificacionaguajeService } from 'src/app/api/logistica/planificacionaguaje.service';
import { PlanificacionprogramaService } from 'src/app/api/logistica/planificacionprograma.service';
import { planificacionProgramaCabecera } from 'src/app/model/PlanificacionPrograma';
import { GestiondespachoPage } from '../logisticadespacho/gestiondespacho/gestiondespacho.page';
import { SearchPage } from 'src/app/search/search.page';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-monitoreodespacho',
  templateUrl: './monitoreodespacho.page.html',
  styleUrls: ['./monitoreodespacho.page.scss'],
})
export class MonitoreodespachoPage implements OnInit {

  listAguaje:any                  = [];
  listDetallePrograma:any         = [];
  loading:any
  objeto:planificacionProgramaCabecera;
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

    
    //31-05-2024 se quita la parte de carga por el aguaje, esto lo hace muy lento
    /*
    await this.serviceLogisticadespacho.getProgramaDetalleLogisticabyIdAguaje(this.objeto.idaguaje).then((respuesta:any) => {
      console.log('list datos' , respuesta)
      this.listDetallePrograma = respuesta;     
    })*/ 

    //cargo los datos de las fechas de despacho
    try {
          await this.presentLoading('Consultando Fechas...');

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

          try{
              await this.presentLoading('Consultando Informacion...');
              await this.serviceLogisticadespacho.getProgramaDetalleLogisticabyIdAguajeAndFechaDespacho(this.objeto.idaguaje , (<any>data).fechadespacho.slice(0,10) ).then((respuesta:any) => {
                console.log('list datos' , respuesta)
                this.listDetallePrograma = respuesta;  
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
        componentProps: { id: item.id , objetoitem: item }
      });
      modal.onDidDismiss().then(data => {
         this.getDatos();
         this.onAguajeSelected();
      })
      return await modal.present();
  }

  async guardar(){

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
          await this.serviceLogisticadespacho.getProgramaDetalleLogisticaMonitorbyIdAguajeExport(this.objeto.idaguaje).then(async (respuesta:any) => {
            console.log('info' , respuesta)
            listainformacion = <any>respuesta;
            this.closeLoading();
          }).catch((error:any) => {
            console.log(error)
            this.closeLoading();
            this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
          })
      }else{
          await this.serviceLogisticadespacho.getProgramaDetalleLogisticaMonitorbyIdAguajeAndFechaDespachoExport(this.objeto.idaguaje, this.fechadespachofiltro).then(async (respuesta:any) => {
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

     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(listainformacion);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'ListaMonitoreDespachos');
     XLSX.writeFile(wb, 'ListaMonitoreDespachos' + '.xlsx');

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

  actualizaCampo(dato:any, campo:any, evento:any){
    console.log(dato, campo)
    if(evento.detail.value){
      let objeto={ campo: campo, id:dato.id, valor: evento.detail.value}
      this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(data => {
  
      })
    }
  }

  formatoFechaDatetime( objetox:any, campo:any) {
    if(objetox[campo]){
      let fechae = formatISO(new Date(objetox[campo]));
      // eval(data) = fechae;
      // this.sleep(100).then(data => {
      //   fechae = formatofecha;
      // })
      objetox[campo] = fechae;
      // this.omovimiento.fechae = fechae;
      console.log(fechae)
    }
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
