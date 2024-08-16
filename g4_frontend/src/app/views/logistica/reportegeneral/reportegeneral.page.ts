import { Component, Injector , OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { VisorPage } from '../../reporte/visor/visor.page';

@Component({
  selector: 'app-reportegeneral',
  templateUrl: './reportegeneral.page.html',
  styleUrls: ['./reportegeneral.page.scss'],
})
export class ReportegeneralPage implements OnInit {


  fechaInicio:any;
  fechaFin:any;

  constructor(public loadingController: LoadingController, public modalCtrl: ModalController ,
    public toastController: ToastController, public alertController: AlertController,) {

  }

  ngOnInit() {
  }
 
  async buscarReporte(){

    if(this.fechaInicio == null) {
      this.showMessage('Seleccione una fecha de inicio', "middle", "danger")
      return;
    }

    if(this.fechaFin == null) {
      this.showMessage('Seleccione una fecha de fin', "middle", "danger")
      return;
    }


    var objeto = {
      fechadesde: this.fechaInicio.slice(0,10),
      fechahasta: this.fechaFin.slice(0,10),
      logo:'logo.jpg'    
    };

    const modal = await this.modalCtrl.create({
      component: VisorPage, backdropDismiss:false, cssClass:'modal-pdf', //modal-80
      componentProps: { reporte: "ProgramacionDetalleDespachos", titulo:"Programacion Detalle Despachos",
        parametros: objeto
      }
    }); //{ID:1} 
    modal.onDidDismiss().then(data => {
      
    })
    return await modal.present();
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


}
