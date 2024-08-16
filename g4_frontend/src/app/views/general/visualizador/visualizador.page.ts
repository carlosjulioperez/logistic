import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-visualizador',
  templateUrl: './visualizador.page.html',
  styleUrls: ['./visualizador.page.scss'],
})
export class VisualizadorPage implements OnInit {

  @Input() titulo:any = 'Visualizador de documentos';
  @Input() dataBlob:any;
  // pdfSrc:any;
  @Input() pdfSrc:any;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.getHtml();
  }

  async getHtml() {
    let reader = new FileReader();
    reader.onload = (e: any) => { this.pdfSrc = e.target.result;};
    reader.readAsArrayBuffer(this.dataBlob);
  }
  
  cerrar(){
    this.modalController.dismiss();
  }
}
