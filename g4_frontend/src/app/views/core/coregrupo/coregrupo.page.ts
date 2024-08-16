import { Component, Injector , OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ButtonEditComponent } from 'src/app/components/button-edit/button-edit.component';
import { CoregrupoService } from 'src/app/api/core/coregrupo.service';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { CoregrupomodalPage } from '../coregrupomodal/coregrupomodal.page';

@Component({
  selector: 'app-coregrupo',
  templateUrl: './coregrupo.page.html',
  styleUrls: ['./coregrupo.page.scss'],
})
export class CoregrupoPage implements OnInit {

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  loading:any

  columnDefs = [  
    {field: 'Editar', cellRenderer: ButtonEditComponent,
      cellRendererParams:{
        clicked: (field:any) =>{
          console.log('click def ')
          this.edit(field)
        }
      } , width: 100
    }, 
    { headerName: 'idgrupo', field: 'idgrupo' , width: 50 , hide: true },
    { headerName: 'Nombre', field: 'nombre' , resizable: true, width: 150 , sortable: true, filter: true },
    { headerName: 'Descripcion', field: 'descripcion' , resizable: true, width: 250 },
    { headerName: 'Estado', field: 'estado' ,  width: 100 }
  ];

  rowData:any = [];
  lista:any = [];


  defaultColDef = {
    sortable: true,
    filter: true
  }

  constructor(private injector:Injector, public modalCtrl: ModalController,public loadingController: LoadingController,
    public toastController: ToastController, public alertController: AlertController, private serviceCoreGrupo:CoregrupoService) {
    //super(injector);
    this.getDatos();
  }

  ngOnInit() {
  }


  async getDatos(){
    try {
      await this.presentLoading();
       
      await this.serviceCoreGrupo.getAll().then((respuesta:any) => {
        console.log('respuesta' , respuesta)
        this.lista=respuesta
        this.rowData = respuesta;
      }).finally(() => { 
        this.closeLoading() 
      })
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }
  }

  edit(item:any){
    console.log('item ->',item)
    this.mostrarCrud(item.idgrupo)
  }


  async mostrarCrud(id:any){
    const modal = await this.modalCtrl.create({
      component: CoregrupomodalPage, backdropDismiss:false, //cssClass:'modal-50-detalle',
      componentProps: { idregistro: id }
    });
    modal.onDidDismiss().then(data => {
       this.getDatos();
    })
    return await modal.present();
  }

  updateFilter(event:any){     
      const val = event.target.value.toLowerCase();
      const temp = this.lista.filter(function(d:any) {
        return !val || d.descripcion.toLowerCase().indexOf(val) !== -1 ;
      });
      this.rowData = temp;     
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
