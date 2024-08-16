import { Component, Injector , OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { corePlantillaTm } from 'src/app/model/CorePlantillaTm';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ButtonEditComponent } from 'src/app/components/button-edit/button-edit.component';
import { ButtonDeleteComponent } from 'src/app/components/button-delete/button-delete.component';
import { CoreplantillaService } from 'src/app/api/core/coreplantilla.service';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { CoregrupomodalPage } from '../coregrupomodal/coregrupomodal.page';
import { GridApi } from 'ag-grid-community'; 
//import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-coreplantilla',
  templateUrl: './coreplantilla.page.html',
  styleUrls: ['./coreplantilla.page.scss'],
})
export class CoreplantillaPage implements OnInit {

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  loading:any
  private gridApi!: GridApi;
  listaMaestros:any = [];
  listaMaestroDetalles:any = [];   
  objetoPlantillatm:corePlantillaTm;

  //variable que contendra el select para hacer el update del item q se seleccione en el grid 
  columnasupdateselect:string = '';
  mostrarcajaseditar:boolean = false;
  estado:number = 0; // 0 es Guardar 1 es Editar
  ID_CAMPO:number = 0;
  loaded = false;

  columnDefs:any = [
    {field: 'Editar', cellRenderer: ButtonEditComponent, sortable: true,filter: false, pinned: 'left',
      cellRendererParams:{
        clicked: (field:any) =>{
          console.log('click def ')
          this.edit(field)
        }
      } , width: 90
    },
    {field: 'Eliminar', cellRenderer: ButtonDeleteComponent, sortable: true,filter: false, pinned: 'left',
    cellRendererParams:{
      clicked: (field:any) =>{         
        this.eliminar(field)
      }
    } , width: 100
  },
    //{ headerName: 'Opcion', field: 'variable' , sortable: true, filter: false, width: 100, pinned: 'left'  }
  ];

  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  }

  rowData:any = [];
  lista:any = [];

  onGridReady(params:any) {
    this.gridApi = params.api;
  }

  overlayLoadingTemplate ='<span class="ag-overlay-loading-center">Cargando su informacion...</span>';
 
  constructor(private injector:Injector, public modalCtrl: ModalController,public loadingController: LoadingController,
    public toastController: ToastController, public alertController: AlertController, private serviceCorePlantilla:CoreplantillaService) { 
    this.objetoPlantillatm = new corePlantillaTm();
    this.getDatos();
 
  }

  ngOnInit() {
  }


  async getDatos(){
    try {
      await this.presentLoading();
       
      this.lista = [];
      this.listaMaestroDetalles = [];
      this.rowData=[];
      this.objetoPlantillatm = new corePlantillaTm();
      await this.serviceCorePlantilla.getAll().then((respuesta:any) => {
        console.log('respuesta' , respuesta)
        this.listaMaestros = respuesta
         
      }).finally(() => { 
        this.closeLoading() 
      })
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }
  }

  async onMaestroSelected(){ //$event:any  listaMaestroDetalles
    this.estado   = 0; // Habilito el estado de Guardar
    this.ID_CAMPO = 0;
    this.listaMaestroDetalles = [];
    this.rowData  = [];
    this.lista    = [];
    this.loaded   = true;

    console.log(this.objetoPlantillatm);
    try {
      //await this.presentLoading();
      if(this.gridApi) this.gridApi.showLoadingOverlay();
      await this.serviceCorePlantilla.getPlantillaTmDetalleByIdCab(this.objetoPlantillatm.idplantillatm).then((respuesta:any) => {
        console.log('respuesta' , respuesta);

        //recupero algun mensaje de error para no avanzar y evitar algun error
        if(respuesta.codigomensaje === 3){
          console.log('codigomensaje 3 => ' , respuesta.codigomensaje);
          this.showMessage(respuesta.mensaje, "middle", "danger");        
          return;
        }

        // mostrar mensaje de alguna advertencia
        if(respuesta.codigomensaje === 2){
          console.log('codigomensaje 2 => ' , respuesta.codigomensaje);
          this.showMessage(respuesta.mensaje, "middle", "warning");          
        }

        //almaceno el select para hacer el update
        this.columnasupdateselect = respuesta.objeto.columnasparaupdate;

        //this.listaMaestroDetalles = respuesta.detalles;
        for (let item of respuesta.objeto.detalles ) {
              //if(item.mostrarcrud){
                this.listaMaestroDetalles.push(item)
              //}
        }

        if(respuesta.objeto.detalles.length >0){
          this.loaded = false;
        }

        //cargar los datos del maestro seleccionado
        if((<any>respuesta.objeto.datosm).length > 0){

          this.columnDefs = [
            {field: 'Editar', cellRenderer: ButtonEditComponent, sortable: true,filter: false, pinned: 'left',
                cellRendererParams:{
                  clicked: (field:any) =>{
                    console.log('click def ')
                    this.edit(field)
                  }
                } , width: 90
              },
              {field: 'Eliminar', cellRenderer: ButtonDeleteComponent, sortable: true,filter: false, pinned: 'left',
              cellRendererParams:{
                clicked: (field:any) =>{         
                  this.eliminar(field)
                }
              } , width: 100
            },
            //{ headerName: 'Opcion', field: 'variable' , sortable: true, filter: false, width: 100, pinned: 'left'  }
          ];

          this.columnDefs = this.columnDefs.slice(0, 2);
          //obtener las cabeceras de las columnas
          for (let columnx of Object.keys((<any>respuesta.objeto.datosm)[0]) ) {
            //if(columnx != "variable" && columnx != "tipo")
              this.columnDefs.push({ 
                headerName: columnx, field: columnx, sortable: true, filter: true, width: 150, cellStyle:{'text-align': "right", 'display':'flex', 'justify-content':'flex-end'}
              })
          }
          /*
          for (let columnx of respuesta.detalles ) {
            if(columnx != "variable" && columnx != "tipo")
              this.columnDefs.push({ 
                headerName: columnx.etiquetagrid, field: columnx.nombrecampo, sortable: true, filter: true, width: 120, cellStyle:{'text-align': "right", 'display':'flex', 'justify-content':'flex-end'}
              })
          }*/
          //asignar la data del maestro
          this.rowData=respuesta.objeto.datosm;
          this.lista = respuesta.objeto.datosm;
        }
        
        if((<any>respuesta.objeto.datosm).length == 0){
          console.log('igual a cero...')

          this.columnDefs = [
            {field: 'Editar', cellRenderer: ButtonEditComponent, sortable: true,filter: false, pinned: 'left',
                cellRendererParams:{
                  clicked: (field:any) =>{
                    console.log('click def ')
                    this.edit(field)
                  }
                } , width: 90
              },
              {field: 'Eliminar', cellRenderer: ButtonDeleteComponent, sortable: true,filter: false, pinned: 'left',
              cellRendererParams:{
                clicked: (field:any) =>{         
                  this.eliminar(field)
                }
              } , width: 100
            },
            //{ headerName: 'Opcion', field: 'variable' , sortable: true, filter: false, width: 100, pinned: 'left'  }
          ];
          /*
          this.columnDefs.push({ 
            headerName: 'Opcion.', field: '', sortable: true, filter: true, width: 150, cellStyle:{'text-align': "right", 'display':'flex', 'justify-content':'flex-end'}
          })*/
        }
         
      }).finally(() => { 
        //this.closeLoading() 
        if(this.gridApi) this.gridApi.hideOverlay();         
      })
    } catch (error:any) {
      this.columnDefs = [
        { headerName: 'Opcion', field: 'variable' , sortable: true, filter: false, width: 100, pinned: 'left'  }
      ];
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }
  }



  updateFilter(event:any){     
     console.log('this.lista ->' , this.lista)
      const val = event.target.value.toLowerCase();
      console.log('event.target. ->' , event.target)
      console.log('val ->' , val)
      const temp = this.lista.filter(function(d:any) {
        //return !val || d.descripcion.toLowerCase().indexOf(val) !== -1 ;
        return !val || String(d.descripcion).toLowerCase().indexOf(val) !== -1 ;
      });
      this.rowData = temp;     
  }

  async nuevo(){
    this.estado   = 0; // Habilito el estado de Guardar
    this.ID_CAMPO = 0;
    if(this.objetoPlantillatm.idplantillatm > 0 ){
      this.onMaestroSelected();
    }    

  }

  async guardar(){
    console.log(this.listaMaestroDetalles);

    if(this.listaMaestroDetalles.length == 0 ){ 
      this.showMessage("No existen datos para guardar..", "middle", "danger");
      return;
    }

    let contador_campos_vacios = 0;
    let mensaje_campos_vacios = '';

    for (let item of this.listaMaestroDetalles ) {
       if(item.mostrarcrud && item.obligatorio && (item.valordefecto == "" || item.valordefecto == 'null' || item.valordefecto == null)
            && (item.idtipocampo == 2  || item.idtipocampo == 6  )  ){
          contador_campos_vacios++;   
          mensaje_campos_vacios = 'El atributo '+ ' ' + '['+ item.etiquetaforma + ']' + ' ' + 'es obligatorio';
          this.showMessage(mensaje_campos_vacios, "middle", "danger");
          return;
       }
    }

    let objeto = {tablanombre: '' , tabladatos: [] , estado: 0 , id: 0 }
    objeto.tablanombre  = this.objetoPlantillatm.descripcion;
    objeto.tabladatos   = this.listaMaestroDetalles;
    objeto.estado       = this.estado;
    objeto.id           = this.ID_CAMPO;

    try {
      await this.presentLoading();

      await this.serviceCorePlantilla.postDetalleMaestro(objeto).then((respuesta:any) => {
          console.log(respuesta)
      }) 

      this.onMaestroSelected();

      this.showMessage("Datos guardados con éxito", "middle", "success");        

    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }finally{
      this.closeLoading();
    }

  }


  async eliminar(item:any){
    console.log('item eliminar seleccionado ->',item)

    this.presentAlertConfirm('Atencion', 'Esta seguro que desea eliminar el registro ?').then(async resp => {
      if(resp){
        
        try {
          await this.presentLoading();
    
          await this.serviceCorePlantilla.getUpdateEstadoTablaMaestra(this.objetoPlantillatm.descripcion , item.id , 0).then((respuesta:any) => {
              //console.log(respuesta)
          }) 
    
          this.onMaestroSelected();
    
          this.showMessage("Datos Eliminados con éxito", "middle", "success");        
    
        } catch (error:any) {
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        }finally{
          this.closeLoading();
        }
        
      }
    })

  }


  async edit(item:any){
    console.log('item seleccionado ->',item)
    //this.mostrarCrud(item.idgrupo)
    this.ID_CAMPO = item.id;
    this.estado = 1;
    try {
      await this.presentLoading();       
       
      this.listaMaestroDetalles = [];      
     
      await this.serviceCorePlantilla.getDatosTablaMaestraById( item.id , this.columnasupdateselect, this.objetoPlantillatm.descripcion  , this.objetoPlantillatm.idplantillatm).then((respuesta:any) => {
        console.log('objeto seleccion' , respuesta.rows)
        this.listaMaestroDetalles = respuesta.rows;
         
      }).finally(() => { 
        this.closeLoading() 
      })
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }

  }


  excelExportar(){
    //if(this.seleccionado != null){
           
       let detalles:any = [];         

       this.listaMaestroDetalles.forEach((item:any) => {

        if(item.mostrarcrud){
          detalles.push(item)
        }

      });

       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(detalles);
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'DetalleInformacion');
       XLSX.writeFile(wb, 'DetalleInformacion' + '.xlsx');    
  }


  imprimir(){
    
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
