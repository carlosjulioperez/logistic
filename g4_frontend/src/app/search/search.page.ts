import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {


  @Input() titulo!: string;
  @Input() filtro!:string;
  @Input() datos!:any[];
  @Input() campos:any;
  @Input() multiple:any=false;

  datosOriginal:any

  constructor(public modalCtrl: ModalController, public toastController: ToastController) {
  }

  ngOnInit() {
    this.datosOriginal = this.datos
  }

  seleccionar(item:any){
    if(!this.multiple)
    this.modalCtrl.dismiss({
      'result': item
    });
  }

  filtrar(){
    this.datos =this.datosOriginal.filter((elemento:any) => {
      for (let camp of this.campos) {
        if(elemento[camp] != null && elemento[camp].toUpperCase().indexOf(this.filtro.toUpperCase()) > -1) return true;
      }
      return false;
    });
  }

  updateFilter(event:any){  
    const filtro = event.target.value.toLowerCase();
    this.datos =this.datosOriginal.filter((elemento:any) => {
      for (let camp of this.campos) {
        if(elemento[camp] != null && elemento[camp].toUpperCase().indexOf(filtro.toUpperCase()) > -1) return true;
      }
      return false;
    });
  }

  guardar(){
    let datos = this.datosOriginal.filter((e:any) => e.check);
    if(datos.length==0){
      this.showMessage('Seleccione un item', 'middle', 'danger')
      return;
    }
    this.modalCtrl.dismiss({
      'result': datos
    });
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
