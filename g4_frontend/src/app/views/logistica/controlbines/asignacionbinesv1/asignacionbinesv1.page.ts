import { Component, Injector , OnInit, ViewChild ,Input } from '@angular/core';
import { LoadingController, ToastController, Platform, AlertController , ModalController } from '@ionic/angular';
import { LogisticadespachoService } from 'src/app/api/logistica/logisticadespacho.service';

@Component({
  selector: 'app-asignacionbinesv1',
  templateUrl: './asignacionbinesv1.page.html',
  styleUrls: ['./asignacionbinesv1.page.scss'],
})
export class Asignacionbinesv1Page implements OnInit {

  @Input() id:number = 0; //esta variable se llena al cargar la pantalla
  loading:any
  listabinesdisponibles:any   = [];
  listabinespiloto:any        = [];
  listabinescopiloto:any      = [];

  

  constructor( public loadingController: LoadingController, public modalController: ModalController ,
    public toastController: ToastController, public alertController: AlertController  , private serviceLogisticadespacho: LogisticadespachoService ) { }

  ngOnInit() {
    this.getDatos();
  }

  async getDatos(){
    try {
        await this.presentLoading();

        await this.serviceLogisticadespacho.getBinesDisponibles().then((respuesta:any) => {
          console.log('list datos' , respuesta)
          if(respuesta.length > 0){         
            this.listabinesdisponibles = respuesta;
          }else{
            console.log('sin datos'  )
            this.listabinesdisponibles = [];
          }
        
        }) 
      } catch (error:any) {
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      } finally {
        this.closeLoading() 
      }
  }



  compareWith(o1:any, o2:any) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((o) => o.id === o1.id);
    }

    return o1.id === o2.id;
  }

  handleChange(ev:any) {
    console.log('Current value:', JSON.stringify(ev.target.value));

  }


  cerrar(){
    this.modalController.dismiss();
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

}
