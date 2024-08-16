import { Component, OnInit, Input, Injector } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { VisorService } from 'src/app/api/report/ireport/visor.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.page.html',
  styleUrls: ['./visor.page.scss'],
})
export class VisorPage implements OnInit {

  @Input() titulo:any ;
  @Input() reporte:any ;
  @Input() parametros: any;
  pdfSrc:any;
  data:any;
  loading:any;

  constructor(public loadingController: LoadingController ,public toastController: ToastController, public modalController: ModalController , private serviceVisor: VisorService) { }

  ngOnInit() {
    console.log('reporte->',this.reporte)
    console.log('parametros->',this.parametros)
     
    this.getReporte();
  }


  async getReporteExcel(){
    try {
      //await this.presentLoading();
      await this.presentLoading('Procesando Excel espere...');
      await this.serviceVisor.getReporteJasperExcel(this.reporte, this.parametros, 'excel').then( (resp:any) => {
        console.log('resp',resp)
        console.log('resp.data',resp.data)
        //this.htmldata =resp
        // this.htmldata = this.sanitizer.bypassSecurityTrustHtml((<any>resp).html);
        //this.data = resp;
        this.closeLoading();
        this.saveAsExcelFile(resp, !this.titulo ? 'Reporte':this.titulo )
     
      }).catch((error:any) => {
        console.log(error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })
    } catch (error) {
      console.log(error)
      this.showMessage('Ha ocurrido un problema al generar el reporte\n' + error)
    } finally { 
      this.closeLoading() 
    }
  }


  async getReporte(){
    try {
      //await this.presentLoading();
      await this.presentLoading('Procesando Pdf espere...');
      await this.serviceVisor.getReporteJasperPdf(this.reporte, this.parametros, 'pdf').then( (resp:any) => {
        console.log('resp',resp)
        console.log('resp.data',resp.data)
        //this.htmldata =resp
        // this.htmldata = this.sanitizer.bypassSecurityTrustHtml((<any>resp).html);
        this.data = resp;
        //Create a Blob from the PDF Stream
      const file = new Blob(
        [resp], 
        {type: 'application/pdf'});

        let reader = new FileReader();
        reader.onload = (e: any) => { this.pdfSrc = e.target.result;};
        reader.readAsArrayBuffer(file);
        this.closeLoading();

      }).catch((error:any) => {
        console.log(error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })
    } catch (error) {
      console.log(error)
      this.showMessage('Ha ocurrido un problema al generar el reporte\n' + error)
    } finally { 
      this.closeLoading() 
    }
  }

  download(){
    this.saveAsPDFFile(this.data, !this.titulo ? 'Reporte':this.titulo )
    //this.serviceVisualizador.getDownload(this.reporte, "pdf", this.parametros)
  }

  public saveAsExcelFile2(): void {
    const data: Blob = new Blob([this.data], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, !this.titulo ? 'Reporte':this.titulo + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  public saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  public saveAsPDFFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: 'application/pdf'});
    FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + '.pdf');
  }


  xzoom=1
  zoom(cantidad:any){
    this.xzoom += Number(cantidad);
    // console.log(this.xzoom)
    // let data = document .getElementsByClassName('jrPage')
    // for(var i=0, len=data.length; i<len; i++)
    // {
    //   (<any>data[i]).style["transform"] = 'scale('+this.xzoom+')';
    //   (<any>data[i]).style["transform-origin"] = '50% 0px';
    // }
  }


  cerrarModal(){
    this.modalController.dismiss();
  }

  s2ab(s:any) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
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
