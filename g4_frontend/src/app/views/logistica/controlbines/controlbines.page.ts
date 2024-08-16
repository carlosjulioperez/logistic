import { Component, Injector , OnInit, ViewChild } from '@angular/core';
import { planificacionProgramaCabecera, planificacionProgramaDetalle } from 'src/app/model/PlanificacionPrograma';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ButtonEditComponent } from 'src/app/components/button-edit/button-edit.component';
import { ButtonDeleteComponent } from 'src/app/components/button-delete/button-delete.component';
import { LoadingController, ToastController, Platform, AlertController , ModalController } from '@ionic/angular';
import { PlanificacionaguajeService } from 'src/app/api/logistica/planificacionaguaje.service';
import { PlanificacionprogramaService } from 'src/app/api/logistica/planificacionprograma.service';
import { SearchPage } from 'src/app/search/search.page';
import { ColDef, CellEditingStartedEvent,
  CellEditingStoppedEvent,  
  ICellRendererParams,
  RowEditingStartedEvent,  
  RowEditingStoppedEvent, ValueFormatterParams , GridApi } from 'ag-grid-community';
import { DateboxEditorComponent } from 'src/app/components/datebox-editor/datebox-editor.component';
import { DateboxRendererComponent } from 'src/app/components/datebox-renderer/datebox-renderer.component';
import { CheckboxsinoComponent } from 'src/app/components/checkbox/checkboxsino/checkboxsino.component';
import { CheckboxnormalComponent } from 'src/app/components/checkbox/checkboxnormal/checkboxnormal.component';
import { TextbuttonComponent } from 'src/app/components/textbutton/textbutton.component';
//import { ClientSideRowModelStep } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
//import { CsvExportModule } from "@ag-grid-community/csv-export";
//import { ModuleRegistry , GetRowIdParams , GridOptions} from '@ag-grid-community/core';
import { Module } from 'ag-grid-community'; //'@ag-grid-community/core';
import { CsvExportModule } from "@ag-grid-community/csv-export";
import * as XLSX from 'xlsx';
import { LogisticadespachoService } from 'src/app/api/logistica/logisticadespacho.service';

@Component({
  selector: 'app-controlbines',
  templateUrl: './controlbines.page.html',
  styleUrls: ['./controlbines.page.scss'],
})
export class ControlbinesPage implements OnInit {

  //@ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('agGridDatos', {static:false}) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  private gridColumnApi:any;

  loading:any
  objeto:planificacionProgramaCabecera;

  rowData:any                = [];
  lista:any                  = [];
  idprogramaciondetalle      = 0;
  productorlabel             = '';
  fechadespachofiltro:any    = null;
  listafechadespacho:any  = [];
  listaproductordetalle:any  = [];
  listaoperadorlogistico:any = [];
  idoperadorlogistico        = 0;
  operadorlogisticolabel     = '';
  noRowsTemplate:any;

  defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    wrapText: true,     // <-- HERE
    autoHeight: true,   // <-- & HERE  
    filter: true,
  }

  gridOptions = {       
    alignedGrids: [], //suppressHorizontalScroll: false, 
    alwaysShowHorizontalScroll: true,
    suppressRowClickSelection: true,
    enableRangeSelection: true,
    enableCharts:true,
    //rowSelection: 'single',
    //rowSelection: 'multiple',
    /*defaultColDef: {
      filter: true,
      floatingFilter: true,
      resizable: true,
    },*/
    defaultColDef: this.defaultColDef,
    getRowNodeId: function (data:any) {
      return data.id;
    },
    /*getRowId: (params: GetRowIdParams) => {
      return params.data.id;
    },*/
     aggFuncs: {
      'SumNb': (params:any) => {
          let sum = 0;
          params.forEach( (value:any) => sum += Number(value) );
          //console.log('params', params);
          //console.log('sumar', sum);
          return this.redondear(sum);
      }
    }, 
    statusBar: {
      statusPanels: [
        { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
        { statusPanel: 'agTotalRowCountComponent', align: 'center' },
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' },
      ],
    },
  };

  // , pinned: 'left'

  columnDefs: ColDef[] = [   
     
    //idlogisticadespacho la columna id
    { headerName: 'ID', field: 'id' ,   width: 40  , resizable: true ,   floatingFilter: true  ,minWidth: 40   , cellStyle: {fontSize: '11px'}    }, //, hide: true , pinned: 'left' 
    { headerName: 'idplanificaciondetalle', field: 'idplanificaciondetalle' ,   width: 40  ,  cellStyle: {fontSize: '11px'} , hide: true },
     
    { headerName: 'idtransporte', field: 'idtransporte' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'Transporte', field: 'transporte' ,  width: 110  , resizable: true ,  floatingFilter: true ,minWidth: 110 , cellStyle: {fontSize: '11px'}  , //pinned: 'left' ,
      editable: false ,       
    },

    { headerName: 'idmaterialbines', field: 'idmaterialbines' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Bines', field: 'bines' ,  width: 100  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 
    
    { headerName: 'idmaterialconica', field: 'idmaterialconica' ,   width: 40  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Conica', field: 'conica' ,  width: 100  , resizable: true ,
      floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} , 
      editable: false , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 
    
    { headerName: 'idmaterialcalada', field: 'idmaterialcalada' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Calada', field: 'calada' ,  width: 100  , resizable: true ,
      floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
       editable: false , valueFormatter: this.currencyFormatter ,  cellEditor: 'numericCellEditor' }, 
    /*
    { headerName: 'idmaterialhielo', field: 'idmaterialhielo' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Hielo', field: 'hielo' ,  width: 80  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 
    */

    { headerName: 'idmaterialmeta', field: 'idmaterialmeta' ,   width: 40  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Meta', field: 'meta' ,  width: 100  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: false , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 

    { headerName: 'idmaterialsal', field: 'idmaterialsal' ,   width: 40  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Sal', field: 'sal' ,  width: 100  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: false , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 

    { headerName: 'idconductor', field: 'idconductor' ,   width: 140  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Conductor', field: 'conductor' ,  width: 180  , resizable: true ,  floatingFilter: true ,minWidth: 180 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
    editable: true ,
    cellRenderer: 'textbuttonRenderer' ,
    cellRendererParams: {
    onClick: this.asignaConductorDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer' },

    { headerName: 'Piloto', field: 'piloto' ,  width: 180  , resizable: true ,  floatingFilter: true ,minWidth: 180 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
    editable: true ,
    /*cellRenderer: 'textbuttonRenderer' ,
    cellRendererParams: {
    onClick: this.asignaPilotoDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer'  */
    },

    { headerName: 'Copiloto', field: 'copiloto' ,  width: 180  , resizable: true ,  floatingFilter: true ,minWidth: 180 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
    editable: true ,
    },  
  ];



  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.setColumnas();
  }  

  overlayLoadingTemplate ='<span class="ag-overlay-loading-center">Cargando su informacion...</span>';
  frameworkComponents: any;

  components:any;
  idplanificaciondetalle:any;
  segmentoActual='segenvio';

  constructor(public loadingController: LoadingController, public modalController: ModalController,
    public toastController: ToastController, public alertController: AlertController,
    private servicePlanificacionAguaje: PlanificacionaguajeService , 
    private serviceLogisticadespacho: LogisticadespachoService ,
    private servicePlanificacionPrograma: PlanificacionprogramaService ,) {
    this.objeto  = new planificacionProgramaCabecera();

    this.noRowsTemplate = `<span>No existe Información a Mostrar</span>`;
    this.frameworkComponents = {
       checkboxRenderer: CheckboxsinoComponent,
       checkboxRendererNormal : CheckboxnormalComponent,
       textbuttonRenderer: TextbuttonComponent
    }
    //this.getDatos();
    this.components = { numericCellEditor: this.getNumericCellEditor() };
   }

  ngOnInit() {
  }

  // setColumnas(){
  //   this.gridColumnApi.setColumnVisible('conductor', this.segmentoActual=='segenvio');
  //   this.gridColumnApi.setColumnVisible('piloto', this.segmentoActual=='segenvio');
  //   this.gridColumnApi.setColumnVisible('copiloto', this.segmentoActual=='segenvio');

  //   this.gridColumnApi.setColumnVisible('binesretorno', this.segmentoActual!='segenvio');
  //   this.gridColumnApi.setColumnVisible('caladaretorno', this.segmentoActual!='segenvio');
  //   this.gridColumnApi.setColumnVisible('conicaretorno', this.segmentoActual!='segenvio');
  //   this.gridColumnApi.setColumnVisible('metaretorno', this.segmentoActual!='segenvio');
  //   this.gridColumnApi.setColumnVisible('salretorno', this.segmentoActual!='segenvio');
  // }

  async buscarAguaje1(){  
    try {

      await this.presentLoading();

      await this.servicePlanificacionAguaje.getAll().then( async (respuesta:any) => {
        console.log('lista aguaje' , respuesta)
        this.closeLoading();

        await this.mostrarFormularioBusqueda('Lista de Aguajes', <any>respuesta, ["numeroaguaje","descripcion","anio"]).then(async data => {
          if(!!data){
            this.objeto.idaguaje  = (<any>data).id
            this.objeto.aguaje    = (<any>data).numeroaguaje + '-' + (<any>data).descripcion + '-' + (<any>data).anio
            this.productorlabel="";
            this.idplanificaciondetalle=null;
            this.rowData=[];
            //cargo los datos detalles del productor del aguaje escogido
              await this.servicePlanificacionPrograma.getProgramaByIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
                console.log('list (<any>respuesta)' , (<any>respuesta))
                this.listaproductordetalle = (<any>respuesta);
              }) 

          }
        })

      })

    } catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally { 
       this.closeLoading() 
    }  
  }  


  async buscarAguaje(){  //modificar
    try {

      await this.presentLoading();

      await this.servicePlanificacionAguaje.getAll().then( async (respuesta:any) => {
        console.log('lista aguaje' , respuesta)
        this.closeLoading();

        await this.mostrarFormularioBusqueda('Lista de Aguajes', <any>respuesta, ["numeroaguaje","descripcion","anio"]).then(async data => {
          if(!!data){
            this.objeto.idaguaje  = (<any>data).id
            this.objeto.aguaje    = (<any>data).numeroaguaje + '-' + (<any>data).descripcion + '-' + (<any>data).anio
            this.productorlabel="";
            this.idplanificaciondetalle=null;
            this.rowData=[];
            //cargo los datos de las fechas de despacho
              await this.servicePlanificacionPrograma.getProgramaFechaDespachobyIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
                console.log('list fecha despacho (<any>respuesta)' , (<any>respuesta))
                this.listafechadespacho = (<any>respuesta);
              }) 

          }
        })

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
          this.idprogramaciondetalle  = (<any>data).id
          this.fechadespachofiltro    =   '['+(<any>data).fechadespacho.slice(0,10)+']';
          //this.fechadespachofiltro    =(<any>data).fechadespacho;

          //cargo los datos detalles del productor del aguaje escogido y la fecha despacho
          await this.servicePlanificacionPrograma.getProgramabyIdAguajeAndFechaDespacho(this.objeto.idaguaje , (<any>data).fechadespacho.slice(0,10)).then( async (respuesta:any) => {
            console.log('list detalles productor' , (<any>respuesta))
            this.listaproductordetalle = (<any>respuesta);
          }) 
           
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


  async buscarProductor(){  
    if(this.objeto.idaguaje == 0){
      this.showMessage("Debe seleccionar un Aguaje", "middle", "danger");
      return;
    }

    if(this.fechadespachofiltro == null){
      this.showMessage("Debe seleccionar una fecha de despacho", "middle", "danger");
      return;
    }

    try {

      //await this.presentLoading(); ,"cantidadprogramada"
      //await this.mostrarFormularioBusqueda('Lista de Productor', this.listaproductordetalle , ["proveedor","sector"]).then(async data => {
      await this.mostrarFormularioBusqueda('Lista de Productor', this.listaproductordetalle , ["proveedor","sector","cliente","piscina"]).then(async data => {
        if(!!data){
          console.log('(<any>data).id' , (<any>data).id)
          this.idprogramaciondetalle  = (<any>data).id
          this.productorlabel    = (<any>data).proveedor + '-' + '['+(<any>data).sector+']' + '-' + '['+(<any>data).cantidadprogramada + ']' + '-' + '['+(<any>data).piscina + ']';
          this.idplanificaciondetalle=(<any>data).id;
          this.getDatosDetalle();
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


  listDetallePrograma:any = [];

  async getDatosDetalle(){
    try {
        await this.presentLoading();

        await this.serviceLogisticadespacho.getInformacionMovilesbyIdPlanificacionDetalle(this.idplanificaciondetalle).then((respuesta:any) => {
          console.log('list datos' , respuesta)
          if(respuesta.length > 0){         
            this.rowData = respuesta;
            this.listDetallePrograma = respuesta;
          }else{
            console.log('sin datos'  )
            this.rowData = [];
          }
        
        }) 
      } catch (error:any) {
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      } finally {
        this.closeLoading() 
      }
  }

  async asignaConductorDetalle(item:any){
    console.log('item ->' , item );
    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getEmpleadoByIdCargo(2).then(async (respuesta:any) => {
          console.log('lista Conductores' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Lista de Conductores', <any>respuesta, ["apellido","nombre","cedula","direccion" ]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
              rowNode.setDataValue('conductor', (<any>data).nombre +' '+(<any>data).apellido);
              //this.gridApi.redrawRows();              
              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idconductor';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto conductor actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
    
            }
          })
        })

    } catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally { 
      this.gridApi.refreshCells();
      this.closeLoading() 
    }  

  }

  async asignaPilotoDetalle(item:any){
    console.log('item ->' , item );


  }

  async asignaCopilotoDetalle(item:any){
    console.log('item ->' , item );


  }


  onRowEditingStarted(event:any) {
    console.log('EVENT->' , event);
  }  

  onRowEditingStopped(event: RowEditingStoppedEvent) {
    console.log('never called - not doing row editing');
  }

  onCellEditingStarted(event: CellEditingStartedEvent) {
    console.log('cellEditingStarted');
  }

  onCellEditingStopped(event: CellEditingStoppedEvent) {
    console.log('cellEditingStopped event' , event);
  }

  onCellValueChanged(event:any) {
    console.log('event.column.colId ->' , event.column.colId, event); 

    if(  event.column.colId == "piloto" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.id;  
      objeto.campo = event.column.colId;  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update piloto ' )
        this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev ->' , data);
        })  

    } 

    if(  event.column.colId == "copiloto" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.id;  
      objeto.campo = event.column.colId;  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update copiloto ' )
        this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev ->' , data);
        })  

    } 

    if(event.column.colId == "binesretorno" ){
      let objeto = {id: event.data.idmaterialbines , campo: 'cantidadretorno' , valor : event.newValue};
      this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto);
    }
    if(event.column.colId == "caladaretorno" ){
      let objeto = {id: event.data.idmaterialcalada , campo: 'cantidadretorno' , valor : event.newValue};
      this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto);
    }
    if(event.column.colId == "conicaretorno" ){
      let objeto = {id: event.data.idmaterialconica , campo: 'cantidadretorno' , valor : event.newValue};
      this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto);
    }
    if(event.column.colId == "metaretorno" ){
      let objeto = {id: event.data.idmaterialmeta , campo: 'cantidadretorno' , valor : event.newValue};
      this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto);
    }
    if(event.column.colId == "salretorno" ){
      let objeto = {id: event.data.idmaterialsal , campo: 'cantidadretorno' , valor : event.newValue};
      this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto);
    }
  }  

  mostrarFormularioBusqueda(titulo:any, datos:any, parametros:any, filtrox='', clase=undefined, multiple=false){
    return new Promise( async (resolve, reject) => {
      const modal = await this.modalController.create({
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

  getNumericCellEditor() {
    function isCharNumeric(charStr:any) {
      return !!/\d/.test(charStr);
    }
    function isKeyPressedNumeric(event:any) {
      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharNumeric(charStr);
    }
    function getCharCodeFromEvent(event:any) {
      event = event || window.event;
      return typeof event.which === 'undefined' ? event.keyCode : event.which;
    }
    function NumericCellEditor() {}
    NumericCellEditor.prototype.init = function (params:any) {
      this.focusAfterAttached = params.cellStartedEdit;
      this.eInput = document.createElement('input');
      this.eInput.style.width = '100%';
      this.eInput.style.height = '100%';
      this.eInput.value = isCharNumeric(params.charPress)
        ? params.charPress
        : params.value;
      var that = this;
      this.eInput.addEventListener('keypress', function (event:any) {
        if (!isKeyPressedNumeric(event)) {
          that.eInput.focus();
          if (event.preventDefault) event.preventDefault();
        }
      });
    };
    NumericCellEditor.prototype.getGui = function () {
      return this.eInput;
    };
    NumericCellEditor.prototype.afterGuiAttached = function () {
      if (this.focusAfterAttached) {
        this.eInput.focus();
        this.eInput.select();
      }
    };
    NumericCellEditor.prototype.isCancelBeforeStart = function () {
      return this.cancelBeforeStart;
    };
    NumericCellEditor.prototype.isCancelAfterEnd = function () {};
    NumericCellEditor.prototype.getValue = function () {
      return this.eInput.value;
    };
    NumericCellEditor.prototype.focusIn = function () {
      var eInput = this.getGui();
      eInput.focus();
      eInput.select();
      console.log('NumericCellEditor.focusIn()');
    };
    NumericCellEditor.prototype.focusOut = function () {
      console.log('NumericCellEditor.focusOut()');
    };
    return NumericCellEditor;
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


  redondear(valor:any, ndecimales=2){
    if(ndecimales != 2){
      let multiple = "1";
      for (let x = 0; x < ndecimales; x++) {
        multiple += "0"
      }
      return Math.round(Number(valor) * Number(multiple)) / Number(multiple)
    }
    return Math.round(Number(valor) * 100) / 100
  }

  currencyFormatter( params:any ) {  //(<any>respuesta))
    //let dato = params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    let dato = Number(params.value).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    //console.log(params.value)
    //console.log(dato)
    let resultado = params.value == null ? null : dato;
    return resultado+''
  }

  currencyFormatterLabel( params:any ) {  //(<any>respuesta))
    //let dato = params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    let dato = Number(params).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    //console.log(params.value)
    //console.log(dato)
    let resultado = params == null ? null : dato;
    return resultado+''
  }

  cambioSegmento(evento:any){
    console.log(evento,this.segmentoActual)
    // this.setColumnas();
  }

  /*
  async excelExportar(){
    let fechas = await this.presentAlertDateDesdeHasta('Seleccione el rango de fechas a exportar');
    if(fechas){
      let datos:any = []; 

      //query a exportar por rango de fechas
  
      if( datos.length == 0) {
        this.showMessage('No se encontro informacion en el rango de fechas', "middle", "danger")
        return;
      }
  
       const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'ControlBines');
       XLSX.writeFile(wb, 'ControlBines' + '.xlsx');
    }
  }*/

  async excelExportar(){
  
    if(this.objeto.idaguaje == 0) {
      this.showMessage('Seleccione un Numero de Aguaje', "middle", "danger")
      return;
    }
 
    if( this.listDetallePrograma.length == 0) {
      this.showMessage('No existe informacion de Materiales a Enviar', "middle", "danger")
      return;
    } 
 
 
     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listDetallePrograma);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'ListaControBines');
     XLSX.writeFile(wb, 'ListaControBines' + '.xlsx');

  }


  async presentAlertDateDesdeHasta(titulox:string, mensajex=null) {
    const dt = new Date();      
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: titulox,
        backdropDismiss: false,
        inputs: [
          {
            name: 'desde',
            type: 'date',
            value: this.format_date(dt),
            max: this.format_date(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+1))
          },
          {
            name: 'hasta',
            type: 'date',
            value: this.format_date(dt),
            max: this.format_date(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()+1))
          }
      ],
        buttons: [
          {
            text: 'Cancelar',
            handler: (blah) => {
              return resolve(false);
            }
          }, {
            text: 'Aceptar',
            handler: (data ) => {
              return resolve({ desde: data.desde, hasta: data.hasta});
            }
          }
        ]
      });
  
      await alert.present();
    });
  }

  private format_date(dt: any) {
    var today = new Date(dt);
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = `0${dd}`;
    }
    if (mm < 10) {
        mm = `0${mm}`;
    }
    return `${yyyy}-${mm}-${dd}`;
}
}
