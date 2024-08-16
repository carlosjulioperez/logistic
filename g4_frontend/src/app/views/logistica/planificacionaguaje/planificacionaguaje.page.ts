import { Component, Injector , OnInit, ViewChild } from '@angular/core';
import { planificacionAguaje } from 'src/app/model/PlanificacionAguaje';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ButtonEditComponent } from 'src/app/components/button-edit/button-edit.component';
import { ButtonDeleteComponent } from 'src/app/components/button-delete/button-delete.component';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { PlanificacionaguajeService } from 'src/app/api/logistica/planificacionaguaje.service';
import { GridApi } from 'ag-grid-community'; 


@Component({
  selector: 'app-planificacionaguaje',
  templateUrl: './planificacionaguaje.page.html',
  styleUrls: ['./planificacionaguaje.page.scss'],
})
export class PlanificacionaguajePage implements OnInit {

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  loading:any
  aguaje:planificacionAguaje;

  columnDefs = [  
    {field: 'Editar', cellRenderer: ButtonEditComponent,   
      cellRendererParams:{
        clicked: (field:any) =>{
          console.log('click def ')
          this.edit(field)
        }
      } , width: 90
    }, 
    {field: 'Eliminar', cellRenderer: ButtonDeleteComponent, 
      cellRendererParams:{
        clicked: (field:any) =>{         
          this.eliminar(field)
        }
      } , width: 100
    },
    { headerName: 'ID', field: 'id' , width: 100  , resizable: true ,   floatingFilter: true }, //, hide: true
    { headerName: 'Año', field: 'anio' ,  width: 110 , resizable: true ,   floatingFilter: true},
    //{ headerName: 'Fecha inicio', field: 'fecha_inicio' , resizable: true, width: 150 , sortable: true, filter: true },
    {headerName: 'Fecha inicio', field: 'fecha_inicio', resizable: true, sortable: true, filter: 'agDateColumnFilter', width: 160, filterParams: {
      comparator: function(filterLocalDateAtMidnight:any, cellValue:any) {
          var dateParts = cellValue.split(' ')[0].split('-');
          var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
        }
    } ,  floatingFilter: true},
    //{ headerName: 'Fecha fin', field: 'fecha_fin' , resizable: true, width: 150 , sortable: true, filter: true },
    {headerName: 'Fecha fin', field: 'fecha_fin', resizable: true, sortable: true, filter: 'agDateColumnFilter', width: 160, filterParams: {
      comparator: function(filterLocalDateAtMidnight:any, cellValue:any) {
          var dateParts = cellValue.split(' ')[0].split('-');
          var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
        }
    } ,  floatingFilter: true},
    { headerName: 'Numero Aguaje', field: 'numeroaguaje' ,  width: 150  , resizable: true ,  floatingFilter: true},
    { headerName: 'Descripcion', field: 'descripcion' , resizable: true, width: 250  ,  floatingFilter: true},
    //{ headerName: 'Estado', field: 'estado' ,  width: 100 }
  ];

  rowData:any = [];
  lista:any = [];

  defaultColDef = {
    sortable: true,
    filter: true
  }

  onGridReady(params:any) {
    this.gridApi = params.api;
  }

  overlayLoadingTemplate ='<span class="ag-overlay-loading-center">Cargando su informacion...</span>';

  constructor( public loadingController: LoadingController,
    public toastController: ToastController, public alertController: AlertController, private servicePlanificacionAguaje: PlanificacionaguajeService ) { 
    this.aguaje = new planificacionAguaje();
    
  }

  ngOnInit() {
    this.getDatos(); 
  }


  async getDatos(){
    try {
      await this.presentLoading();
       
      await this.servicePlanificacionAguaje.getAll().then((respuesta:any) => {
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

  async guardar(){
    if(this.aguaje.anio == 0) {
      this.showMessage('Ingrese un número de Año Válido', "middle", "danger")
      return;
    }
    if(this.aguaje.numeroaguaje == 0) {
      this.showMessage('Ingrese un número de Aguaje Válido', "middle", "danger")
      return;
    }
    if(this.aguaje.fecha_inicio.trim().length == 0) {
      this.showMessage('Ingrese una fecha de Inicio de Aguaje', "middle", "danger")
      return;
    }
    if(this.aguaje.fecha_fin.trim().length == 0) {
      this.showMessage('Ingrese una fecha de Fin de Aguaje', "middle", "danger")
      return;
    }
    if(this.aguaje.descripcion.trim().length == 0) {
      this.showMessage('Ingrese una Descripcion', "middle", "danger")
      return;
    }
    
    await this.presentLoading();
    //this.usuario["plataforma"] = this.platform.platforms().toString();
    this.servicePlanificacionAguaje.post(this.aguaje).then(async (resp:any) => {
       console.log('respuesta',resp) ;      
      this.getDatos();         
      this.nuevo();   
      this.showMessage("Datos guardados con éxito", "middle", "success");  
    
    }).catch((error:any) => {
      console.log(error)
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }).finally( () => {
      this.closeLoading();
    })
    
  }

  async nuevo(){
    this.aguaje = new planificacionAguaje();
  }

  edit(item:any){
    //console.log('item ->',item)
    this.aguaje = item;     
  }

  async eliminar(item:any){
    console.log('item eliminar seleccionado ->',item)

    this.presentAlertConfirm('Atencion', 'Esta seguro que desea eliminar el registro ?').then(async resp => {
      if(resp){
        
        try {
          await this.presentLoading();
          item.estado = 0;
          this.servicePlanificacionAguaje.post(item).then(async (resp:any) => {
            console.log('respuesta',resp) ;      
           //this.getDatos();            
           //this.showMessage("Datos Eliminados con éxito", "middle", "success");  
         
         })
    
          this.getDatos();            
          this.nuevo();
          this.showMessage("Datos Eliminados con éxito", "middle", "success");        
    
        } catch (error:any) {
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        }finally{
          this.closeLoading();
        }
        
      }
    })

  }

  updateFilter(event:any){     
    const val = event.target.value.toLowerCase();
    const temp = this.lista.filter(function(d:any) {
      return !val || d.descripcion.toLowerCase().indexOf(val) !== -1 ;
    });
    this.rowData = temp;     
  }

  excelExportar(){

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
