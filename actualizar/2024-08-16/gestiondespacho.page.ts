import { Component, Injector , OnInit, ViewChild ,Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; 
import { LoadingController, ToastController, Platform, AlertController , ModalController } from '@ionic/angular';
import { ColDef, CellEditingStartedEvent,
  CellEditingStoppedEvent,  
  ICellRendererParams,
  RowEditingStartedEvent,  
  RowEditingStoppedEvent, ValueFormatterParams , GridApi } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { Module } from 'ag-grid-community'; //'@ag-grid-community/core';
import { CsvExportModule } from "@ag-grid-community/csv-export"; 
import * as XLSX from 'xlsx';
import { TextbuttonComponent } from 'src/app/components/textbutton/textbutton.component';
import { LogisticadespachoService } from 'src/app/api/logistica/logisticadespacho.service';
import { PlanificacionprogramaService } from 'src/app/api/logistica/planificacionprograma.service';
import { SearchPage } from 'src/app/search/search.page';
import { ButtonDeleteComponent } from 'src/app/components/button-delete/button-delete.component';


@Component({
  selector: 'app-gestiondespacho',
  templateUrl: './gestiondespacho.page.html',
  styleUrls: ['./gestiondespacho.page.scss'],
})
export class GestiondespachoPage implements OnInit {


  @Input() id:number = 0; //esta variable se llena al cargar la pantalla
  @Input() objetoitem:any;
  @Input() listDetallePrograma:any  = [];

  @ViewChild('agGridDatos', {static:false}) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  private gridColumnApi:any;

  //modules:Module[] = [ClientSideRowModelModule , CsvExportModule];

  loading:any

  rowData:any     = [];
  lista:any       = [];
  noRowsTemplate:any;
  frameworkComponents: any;

  columnDefs: ColDef[] = [   
    {field: 'Eliminar', cellRenderer: ButtonDeleteComponent, 
      cellRendererParams:{
        clicked: (field:any) =>{         
          this.eliminar(field)
        }
      } , width: 85  , pinned: 'left'
    },
    //idlogisticadespacho la columna id
    { headerName: 'ID', field: 'id' ,   width: 80  , resizable: true ,   floatingFilter: true  ,minWidth: 80   , cellStyle: {fontSize: '11px'}    }, //, hide: true , pinned: 'left' 
    { headerName: 'idplanificaciondetalle', field: 'idplanificaciondetalle' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
        
    { headerName: 'idpiscina', field: 'idpiscina' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'Piscina', field: 'piscina' ,  width: 100  , resizable: true ,  floatingFilter: true ,minWidth: 100 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer',
      cellRendererParams: {
      onClick: this.asignaPlanificacionDetalle.bind(this), 
      } , cellEditor: 'textbuttonRenderer' },


    { headerName: 'idbiologo', field: 'idbiologo' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'Biologo', field: 'biologo' ,  width: 140  , resizable: true ,  floatingFilter: true ,minWidth: 140 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer',
      cellRendererParams: {
      onClick: this.asignaBiologoDetalle.bind(this), 
      } , cellEditor: 'textbuttonRenderer' },

    { headerName: 'idtransporte', field: 'idtransporte' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'Transporte', field: 'transporte' ,  width: 110  , resizable: true ,  floatingFilter: true ,minWidth: 110 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
      onClick: this.asignaTransporteDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer' },

    { headerName: 'idconductor', field: 'idconductor' ,   width: 140  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Conductor', field: 'conductor' ,  width: 180  , resizable: true ,  floatingFilter: true ,minWidth: 180 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
      onClick: this.asignaConductorDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer' },  

    { headerName: 'idproveedorhielo', field: 'idproveedorhielo' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Proveedor Hielo', field: 'proveedorhielo' ,  width: 165  , resizable: true ,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
          onClick: this.asignaProveedorDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer' },

    { headerName: 'idoperadorlogistico', field: 'idoperadorlogistico' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'OPL', field: 'operadorlogistico' ,  width: 145  , resizable: true ,  floatingFilter: true ,minWidth: 100 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
          onClick: this.asignaOperadorLogisticoDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer' },

    { headerName: 'idsucursal', field: 'idsucursal' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Base Operacion', field: 'sucursal' ,  width: 145  , resizable: true ,  floatingFilter: true ,minWidth: 130 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
          onClick: this.asignaSucursalBaseDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer' },  

    { headerName: 'idmaterialbines', field: 'idmaterialbines' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Bines', field: 'bines' ,  width: 80  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 
    
    { headerName: 'idmaterialconica', field: 'idmaterialconica' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Conica', field: 'conica' ,  width: 80  , resizable: true ,
      floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} , 
      editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 
    
    { headerName: 'idmaterialcalada', field: 'idmaterialcalada' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Calada', field: 'calada' ,  width: 80  , resizable: true ,
      floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
       editable: true , valueFormatter: this.currencyFormatter ,  cellEditor: 'numericCellEditor' }, 
    
    { headerName: 'idmaterialhielo', field: 'idmaterialhielo' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Hielo', field: 'hielo' ,  width: 80  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 


    { headerName: 'idmaterialmeta', field: 'idmaterialmeta' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Meta', field: 'meta' ,  width: 80  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 
    
    { headerName: 'idtipometabisulfito', field: 'idtipometabisulfito' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Tipo Meta', field: 'tipometa' ,  width: 145  , resizable: true ,  floatingFilter: true ,minWidth: 130 , cellStyle: {fontSize: '9px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
          onClick: this.asignaTipoMetabisulfitoBaseDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer' },  

    { headerName: 'idmaterialsal', field: 'idmaterialsal' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true }, 
    { headerName: 'Sal', field: 'sal' ,  width: 80  , resizable: true , 
     floatingFilter: true ,minWidth: 80 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
      editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' }, 

    { headerName: 'LibrasMovil', field: 'cantidadprogramada' ,  width: 150  , resizable: true , 
     floatingFilter: true ,minWidth: 120 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} ,
     editable: true , valueFormatter: this.currencyFormatter , cellEditor: 'numericCellEditor' },   

  ];

  defaultColDef = {
    flex: 1,
    resizable: true,
    sortable: true,
    wrapText: true,     // <-- HERE
    autoHeight: true,   // <-- & HERE  
    filter: true,
   
  }

  bottomData:any = [];


  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
 
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

  overlayLoadingTemplate ='<span class="ag-overlay-loading-center">Cargando su informacion...</span>';
 
  components:any;

  constructor(public loadingController: LoadingController, public modalController: ModalController ,
    public toastController: ToastController, public alertController: AlertController  ,
    private serviceLogisticadespacho: LogisticadespachoService ,
    private servicePlanificacionPrograma: PlanificacionprogramaService ) {
    this.noRowsTemplate = `<span>No existe Información a Mostrar</span>`;
    this.frameworkComponents = {       
       textbuttonRenderer: TextbuttonComponent
    }
    this.components = { numericCellEditor: this.getNumericCellEditor() };
   }

  ngOnInit() {
    this.getDatos();
    console.log('objetoitem recibido ->', this.objetoitem)
  }


  async getDatos(){
    try {
        await this.presentLoading();

        await this.serviceLogisticadespacho.getInformacionMovilesbyIdPlanificacionDetalle(this.id).then((respuesta:any) => {
          console.log('list datos' , respuesta)
          if(respuesta.length > 0){         
            this.rowData = respuesta;
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




  async asignaProveedorDetalle(item:any){
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        // proveedores de hielo son el tipo 2
        await this.servicePlanificacionPrograma.getProveedorByIdtipo(2).then(async (respuesta:any) => {
          console.log('lista proveedor hielo' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Lista de Proveedores', <any>respuesta, ["descripcion","direccion"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
              //console.log('rowNode ->' , rowNode);
              //console.log('rowNode.data->' , rowNode.data);
              //console.log(' proveedor escogido ->' ,  (<any>data).descripcion);
              rowNode.setDataValue('proveedorhielo', (<any>data).descripcion);
              //objeto.idproveedor      =   (<any>data).id;

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idproveedorhielo';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto proveedor hielo actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
   

              //this.gridApi.refreshCells();
              //this.gridApi.redrawRows();
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

  async asignaOperadorLogisticoDetalle(item:any){
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        // proveedores Operadores Logisticos son el tipo 7
        await this.servicePlanificacionPrograma.getProveedorByIdtipo(7).then(async (respuesta:any) => {
          console.log('lista' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Operadores Logisticos', <any>respuesta, ["descripcion","direccion"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
              //console.log('rowNode ->' , rowNode);
              //console.log('rowNode.data->' , rowNode.data);
              //console.log(' proveedor escogido ->' ,  (<any>data).descripcion);
              rowNode.setDataValue('operadorlogistico', (<any>data).descripcion);
              //objeto.idproveedor      =   (<any>data).id;

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idoperadorlogistico';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto operadorlogistico actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
              //this.gridApi.refreshCells();
              //this.gridApi.redrawRows();
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


  //con este metodo se cambia de "PISCINA"
  async asignaPlanificacionDetalle(item:any){
    console.log('item ->' , item );

    try {
        //await this.presentLoading();
        
       // await this.servicePlanificacionPrograma.getProveedorByIdtipo(7).then(async (respuesta:any) => {
          //console.log('lista' , respuesta) 
          //this.closeLoading();
          await this.mostrarFormularioBusqueda('Seleccione Piscina', this.listDetallePrograma, ["cliente","proveedor","sector","piscina"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
              //console.log('rowNode ->' , rowNode);
              //console.log('rowNode.data->' , rowNode.data);
              //console.log(' proveedor escogido ->' ,  (<any>data).descripcion);
              rowNode.setDataValue('piscina', (<any>data).piscina);
              //objeto.idproveedor      =   (<any>data).id;

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idplanificaciondetalle';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto piscina actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
              //this.gridApi.refreshCells();
              //this.gridApi.redrawRows();
            }
          })
        //})

    } catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally { 
      this.gridApi.refreshCells();
      //this.closeLoading() 
    }  

  }


  async asignaSucursalBaseDetalle(item:any){
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        // proveedores Operadores Logisticos son el tipo 7
        await this.servicePlanificacionPrograma.getSucursal().then(async (respuesta:any) => {
          console.log('lista' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Base Operacion', <any>respuesta, ["descripcion","identificacion"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
               
              rowNode.setDataValue('sucursal', (<any>data).descripcion);
              //objeto.idproveedor      =   (<any>data).id;

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idsucursal';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto sucursal actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
              //this.gridApi.refreshCells();
              //this.gridApi.redrawRows();
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

  async asignaTipoMetabisulfitoBaseDetalle(item:any){
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        // proveedores Operadores Logisticos son el tipo 7
        await this.servicePlanificacionPrograma.getTipoMetabisulfito().then(async (respuesta:any) => {
          console.log('lista' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Tipo Meta', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
               
              rowNode.setDataValue('tipometa', (<any>data).descripcion);
              //objeto.idproveedor      =   (<any>data).id;

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idtipometabisulfito';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto tipometabisulfito actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
              //this.gridApi.refreshCells();
              //this.gridApi.redrawRows();
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


  async asignaTransporteDetalle(item:any){
    console.log('item ->' , item );
    try {
        await this.presentLoading();
        // proveedores de hielo son el tipo 2
        await this.serviceLogisticadespacho.getTransporte().then(async (respuesta:any) => {
          console.log('lista transporte' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Lista de Transportes', <any>respuesta, ["placa"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
              rowNode.setDataValue('transporte', (<any>data).descripcion);
              
              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idtransporte';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto transporte actualizado->' , data);
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

  async asignaBiologoDetalle(item:any){
    console.log('item ->' , item );
    try {
        await this.presentLoading();
        
        await this.serviceLogisticadespacho.getBiologo().then(async (respuesta:any) => {
          console.log('lista biologo' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Lista de Biologo', <any>respuesta, ["apellido","nombre","cedula","direccion" ]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
              rowNode.setDataValue('biologo', (<any>data).nombre +' '+(<any>data).apellido);
              //this.gridApi.redrawRows();              
              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idbiologo';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
                this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto biologo actualizado->' , data);
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
    console.log('event.column.colId ->' , event.column.colId); 
    let proveedor =    event.column.colId.replace(/\s+/g, ''); 
    //console.log('proveedor ->' , proveedor); 
    
    if(  event.column.colId =="cantidadprogramada" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.id;  
      objeto.campo = event.column.colId;  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update' )
        this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev->' , data);
        })  

    } 

    if(  event.column.colId == "bines" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.idmaterialbines;  
      objeto.campo = 'cantidad';  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update material' )
        this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev material->' , data);
        })  

    } 
    

    if(  event.column.colId == "conica" ){
      console.log('******event.data' , event.data)
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.idmaterialconica;  
      objeto.campo = 'cantidad';  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update material conica' )
        this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev material conica->' , data);
        })  

    } 

    if(  event.column.colId == "calada" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.idmaterialcalada;  
      objeto.campo = 'cantidad';  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update material calada' )
        this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev material calada->' , data);
        })  

    } 
    

    if(  event.column.colId == "hielo" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.idmaterialhielo;  
      objeto.campo = 'cantidad';  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update material hielo' )
        this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev material hielo->' , data);
        })  

    } 


    if(  event.column.colId == "meta" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.idmaterialmeta;  
      objeto.campo = 'cantidad';  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update material meta' )
        this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev material meta->' , data);
        })  

    } 

    if(  event.column.colId == "sal" ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.idmaterialsal;  
      objeto.campo = 'cantidad';  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue);
      //if(event.newValue != ''){
        console.log('entra al proceso de update material sal' )
        this.serviceLogisticadespacho.postUpdateMaterialDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev material sal->' , data);
        })  

    } 
    

  }


  async agregarNuevoDetalle(){

    try {
      await this.presentLoading();
      let idusuario = this.serviceLogisticadespacho.userService.usuario.id;  
      let objeto = {idplanificaciondetalle :0 , idusuario: 0};
      objeto.idplanificaciondetalle =   this.id;  
      objeto.idusuario = idusuario;
      this.serviceLogisticadespacho.postCreateLogisticaDespachoEmpty(objeto).then(async (resp:any) => {
        console.log('respuesta',resp) ;      
       this.getDatos();            
       //this.showMessage(" mensaje ", "middle", "success");  
     })

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
          let objeto = {id :0 , campo: '' , valor : 0};
          objeto.id =   item.id;  
          objeto.campo = "estado";  
          objeto.valor = 0;
          this.serviceLogisticadespacho.postUpdateDetalle(objeto).then(async (resp:any) => {
            console.log('respuesta',resp) ;      
           this.getDatos();            
           this.showMessage("Datos Eliminados con éxito", "middle", "success");  
         
         })
    
          //this.getDatos();                   
          //this.showMessage("Datos Eliminados con éxito", "middle", "success");        
    
        } catch (error:any) {
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        }finally{
          this.closeLoading();
        }
        
      }
    })

  }


  currencyFormatter( params:any ) {  //(<any>respuesta))
    //let dato = params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    let dato = Number(params.value).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    //console.log(params.value)
    //console.log(dato)
    let resultado = params.value == null ? null : dato;
    return resultado+''
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

  cerrar(){
    this.modalController.dismiss();
  }

  mostrarFormularioBusqueda(titulo:any, datos:any, parametros:any, filtrox='', clase=undefined, multiple=false){
    return new Promise( async (resolve, reject) => {
      const modal = await this.modalController.create({
        component: SearchPage, backdropDismiss:false, cssClass:clase,
        componentProps: {titulo:titulo, datos: datos, campos:parametros, filtro: filtrox, multiple: multiple}
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

}
