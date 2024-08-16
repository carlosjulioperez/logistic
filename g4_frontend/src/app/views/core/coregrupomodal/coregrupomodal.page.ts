import { Component, OnInit , Injector, Input, QueryList, ViewChildren } from '@angular/core'; 
import { IonInput, ModalController } from '@ionic/angular';
import { coreGrupo } from 'src/app/model/CoreGrupo';
import { CoregrupoService } from 'src/app/api/core/coregrupo.service';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-coregrupomodal',
  templateUrl: './coregrupomodal.page.html',
  styleUrls: ['./coregrupomodal.page.scss'],
})
export class CoregrupomodalPage implements OnInit {

  @Input() idregistro:number = 0;
  objeto:coreGrupo;
  loading:any;

  constructor(public modalCtrl: ModalController,public loadingController: LoadingController,
    public toastController: ToastController, public alertController: AlertController, private serviceCoreGrupo:CoregrupoService) {
     this.objeto = new coreGrupo();
     this.cargarDatos();
   }

  ngOnInit() {
  }

  async cargarDatos(loading=true){
    try {
      if(loading) await this.presentLoading();

      /*await this.serviceAreaProductiva.getAll().then(data => { 
        this.listAreaProductiva = data ;         
      }); */

      if(this.idregistro > 0){
        await this.serviceCoreGrupo.getObjectById(this.idregistro).then(async data => { 
          this.objeto = <any>data;
         
        })
      }
      
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    } finally {
      if(loading) await this.closeLoading()
    }

  }


  async guardar(){
    try {
      //if(this.permisoGrabar(this.objeto.id)){
        
        if(this.objeto.nombre == null  ){ 
          this.showMessage("Debe ingresar un nombre", "middle", "danger");
          return;
        }

        if(this.objeto.descripcion == null  ){ 
          this.showMessage("Debe ingresar una descripcion", "middle", "danger");
          return;
        }
 
        await this.presentLoading();
        //this.objeto.idusuario = this.auth.usuarioActual.id;
        console.log('this.objeto->', this.objeto);
        await this.serviceCoreGrupo.post(this.objeto).then(async data => {
          this.idregistro = (<any>data).id;
          this.showMessage("Datos guardados con éxito", "middle", "success");             
          await this.cargarDatos(false);
          this.modalCtrl.dismiss();
        }).finally(async () => { 
          await this.closeLoading()
        })
        

      //}
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }
  }



  cerrarModal(){
    this.modalCtrl.dismiss();
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
}
