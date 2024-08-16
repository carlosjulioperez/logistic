import { Component, Injector , OnInit, ViewChild } from '@angular/core';
import { planificacionProgramaCabecera, planificacionProgramaDetalle } from 'src/app/model/PlanificacionPrograma';
import { AgGridAngular } from 'ag-grid-angular'; 
import { ButtonEditComponent } from 'src/app/components/button-edit/button-edit.component';
import { ButtonDeleteComponent } from 'src/app/components/button-delete/button-delete.component';
import { ButtonActivateComponent } from 'src/app/components/button-activate/button-activate.component';
import { ButtonDesactivateComponent } from 'src/app/components/button-desactivate/button-desactivate.component';
import { LoadingController, ToastController, Platform, AlertController , ModalController } from '@ionic/angular';
import { PlanificacionaguajeService } from 'src/app/api/logistica/planificacionaguaje.service';
import { PlanificacionprogramaService } from 'src/app/api/logistica/planificacionprograma.service';
import { SearchPage } from 'src/app/search/search.page';
//import { GridApi } from 'ag-grid-community'; 
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

//https://www.ag-grid.com/angular-data-grid/modules/
// Register the required feature modules with the Grid
//ModuleRegistry.registerModules([ClientSideRowModelModule]);


@Component({
  selector: 'app-planificacionprograma',
  templateUrl: './planificacionprograma.page.html',
  styleUrls: ['./planificacionprograma.page.scss'],
})
export class PlanificacionprogramaPage implements OnInit {

  //@ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('agGridDatos', {static:false}) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  private gridColumnApi:any;

  //modules:Module[] = [ClientSideRowModelModule , CsvExportModule];


  loading:any
  objeto:planificacionProgramaCabecera;
  objetodetalle:planificacionProgramaDetalle;
  components:any;
  librastotales:Number = 0;
  librasaguaje:Number = 0;

  listAguaje:any        = [];
  listClientes:any      = [];
  listTipoProceso:any   = [];
  listPropiedad:any     = [];
  listProveedor:any     = [];
  listComprador:any     = [];
  listSector:any        = [];
  listCampamento:any    = [];
  listMetodocosecha:any = [{idmetodocosecha:1 , descripcion: 'DIRECTO'} , {idmetodocosecha:2 , descripcion: 'INMERSION'}];
  listPiscina:any       = [];
  listStatus:any        = [{id:1 , descripcion: 'PESCA CONFIRMADA'}, {id:2 , descripcion: 'PESCA NO CONFIRMADA'} , {id:3 , descripcion: 'ELIMINADA/ANULADA'}];


  rowData:any     = [];
  lista:any       = [];
  noRowsTemplate:any;
  rowClassRules :any;

  columnDefs: ColDef[] = [   
    {field: 'Desactivar', cellRenderer: ButtonDesactivateComponent, 
      cellRendererParams:{
        clicked: (field:any) =>{         
          this.eliminar(field)
        }
      } , width: 90  , pinned: 'left'  
    },
    {field: 'Activar', cellRenderer: ButtonActivateComponent, 
    cellRendererParams:{
      clicked: (field:any) =>{         
        this.activar(field)
      }
    } , width: 85  , pinned: 'left'
  },
    { headerName: 'ID', field: 'id' ,   width: 80  , resizable: true ,   floatingFilter: true  ,minWidth: 60   , cellStyle: {fontSize: '11px'} , pinned: 'left'  }, //, hide: true , pinned: 'left' 
    { headerName: 'Confi.', field: 'confirmada' ,  width: 100  , resizable: true , floatingFilter: true ,minWidth: 100 , cellStyle: {fontSize: '11px'} , pinned: 'left',
      editable: true  ,
      cellRenderer: 'checkboxRendererNormal',
      cellRendererParams: {
        onClick: this.aplicaCierre.bind(this),
      }  }, //, cellEditor: CheckboxsinoComponent checkboxRenderer checkboxRendererNormal
    { headerName: 'idprogramapesca', field: 'idprogramapesca' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'idcliente', field: 'idcliente' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'idproveedor', field: 'idproveedor' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'fechadespacho', field: 'fechadespacho' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'idtipoproceso', field: 'idtipoproceso' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'idcomprador', field: 'idcomprador' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    //{ headerName: 'idaguaje', field: 'idaguaje' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'Sociedad', field: 'sociedad' ,  width: 120  , resizable: true ,  floatingFilter: true , minWidth: 120 , cellStyle: {fontSize: '8px'}  , pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
        onClick: this.asignaSociedadDetalle.bind(this),
      } , cellEditor: 'textbuttonRenderer'  }, //, pinned: 'left' 
    /*{ headerName: 'Cliente', field: 'cliente' ,  width: 155  , resizable: true ,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '9px'}  , pinned: 'left' ,
       editable: false ,
    },*/
    { headerName: 'Cliente', field: 'cliente' ,  width: 165  , resizable: true ,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '9px'}  , pinned: 'left' ,
       editable: true ,
       cellRenderer: 'textbuttonRenderer' ,
       cellRendererParams: {
        onClick: this.asignaClienteDetalle.bind(this),
       } , cellEditor: 'textbuttonRenderer' }, //, pinned: 'left'     
    { headerName: 'Proveedor', field: 'proveedor' ,  width: 165  , resizable: true ,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '9px'}  , pinned: 'left' ,
       editable: true ,
       cellRenderer: 'textbuttonRenderer' ,
       cellRendererParams: {
        onClick: this.asignaProveedorDetalle.bind(this),
       } , cellEditor: 'textbuttonRenderer' }, //, pinned: 'left' 
    { headerName: 'Sector Proveedor', field: 'sector' ,  width: 120  , resizable: true , wrapText: true,  floatingFilter: true , minWidth: 120 , cellStyle: {fontSize: '8px'}  , pinned: 'left' ,
       editable: true ,
       cellRenderer: 'textbuttonRenderer' ,
        cellRendererParams: {
          onClick: this.asignaSectorDetalle.bind(this),
        } , cellEditor: 'textbuttonRenderer'  }, //, pinned: 'left' 
    { headerName: 'Sector Cliente', field: 'sectorcliente' ,  width: 120  , resizable: true , wrapText: true,  floatingFilter: true , minWidth: 120 , cellStyle: {fontSize: '8px'}  , pinned: 'left' ,
        editable: true ,
        cellRenderer: 'textbuttonRenderer' ,
         cellRendererParams: {
           onClick: this.asignaSectorClienteDetalle.bind(this),
         } , cellEditor: 'textbuttonRenderer'  }, //, pinned: 'left' 
    { headerName: 'Muelle', field: 'muelle' ,  width: 120  , resizable: true , wrapText: true,  floatingFilter: true , minWidth: 120 , cellStyle: {fontSize: '8px'}  , pinned: 'left' ,
         editable: true ,
         cellRenderer: 'textbuttonRenderer' ,
          cellRendererParams: {
            onClick: this.asignaMuelleDetalle.bind(this),
          } , cellEditor: 'textbuttonRenderer'  }, //, pinned: 'left'      

    { headerName: 'Piscina', field: 'piscina' ,  width: 90  , resizable: true ,  floatingFilter: true ,minWidth: 100  , cellStyle: {fontSize: '11px'} , 
        editable: true ,
        cellRenderer: 'textbuttonRenderer' ,
        cellRendererParams: {
          onClick: this.asignaPiscinaDetalle.bind(this),
        } , cellEditor: 'textbuttonRenderer'  }, //, pinned: 'left' 
    { headerName: 'Libras \n Programadas', field: 'cantidadprogramada' ,  width: 150  , resizable: true ,wrapText: true,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} , editable: true , valueFormatter: this.currencyFormatter},
    { headerName: 'Gramos', field: 'gramaje' ,  width: 100  , resizable: true ,  floatingFilter: true ,minWidth: 100 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} , editable: true , valueFormatter: this.currencyFormatter},
    { headerName: 'Cant. \n Compuertas', field: 'numeropuerta' ,  width: 150  , resizable: true , wrapText: true, floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} , editable: true },
    { headerName: 'Metodo \n Cosecha', field: 'metodocosecha' ,  width: 150  , resizable: true , wrapText: true,  
       floatingFilter: true ,minWidth: 120 , cellStyle: {fontSize: '11px'},
       editable: true ,
       cellRenderer: 'textbuttonRenderer' ,
       cellRendererParams: {
         onClick: this.asignaMetodoCosechaDetalle.bind(this),
       } , cellEditor: 'textbuttonRenderer'
       //cellEditor: 'agSelectCellEditor',
       //cellEditorParams: {
        //values:  this.extractValues(this.listMetodocosecha)
       //},
      /*
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) => {
          return this.lookupValue(this.listMetodocosecha, params.value.descripcion);
        },
      },*/
      //valueFormatter: (params) => {
        // aki return this.lookupValue(this.listMetodocosecha, params.value);
      //},
      /*valueParser: (params) => {
        return this.lookupKey(this.listMetodocosecha, params.newValue);
      },*/

    },
    //{ headerName: 'Fecha inicio', field: 'fecha_inicio' , resizable: true, width: 150 , sortable: true, filter: true },
    {headerName: 'Fecha de \n despacho', field: 'fechadespacho', resizable: true, sortable: true, filter: 'agDateColumnFilter', width: 160, filterParams: {
      comparator: function(filterLocalDateAtMidnight:any, cellValue:any) {
          var dateParts = cellValue.split(' ')[0].split('-');
          var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
        }
    } ,  floatingFilter: true , minWidth: 140 , cellStyle: {fontSize: '11px'} , editable: false,  cellRenderer: DateboxRendererComponent,  cellEditor: DateboxEditorComponent },
    //{ headerName: 'Fecha fin', field: 'fecha_fin' , resizable: true, width: 150 , sortable: true, filter: true },
    {headerName: 'Fecha Materiales Campo', field: 'fechamaterialescampo', resizable: true, sortable: true, filter: 'agDateColumnFilter', width: 160, filterParams: {
      comparator: function(filterLocalDateAtMidnight:any, cellValue:any) {
          var dateParts = cellValue.split(' ')[0].split('-');
          var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
        } 
      } ,   floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '11px'}  ,  
            editable: true,  cellRenderer: DateboxRendererComponent,  cellEditor: DateboxEditorComponent
    },  
    {headerName: 'Fecha Arribo Planta', field: 'fechaarriboplanta', resizable: true, sortable: true, filter: 'agDateColumnFilter', width: 160, filterParams: {
      comparator: function(filterLocalDateAtMidnight:any, cellValue:any) {
          var dateParts = cellValue.split(' ')[0].split('-');
          var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
        }
    } ,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '11px'} , editable: true,  cellRenderer: DateboxRendererComponent,  cellEditor: DateboxEditorComponent},
    { headerName: 'Observacion Compras', field: 'observacioncompras' , resizable: true, width: 250  ,  floatingFilter: true ,minWidth:200 , cellStyle: {fontSize: '11px'} , editable: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorPopup: true,
      cellEditorParams: {
        maxLength: '300',
        cols: '50',
        rows: '6',
      }
    },
    { headerName: 'Libras \n Confirmadas', field: 'cantidadconfirmada' ,  width: 150  , resizable: true ,wrapText: true,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '11px' , 'text-align': 'right'} , editable: true , valueFormatter: this.currencyFormatter},

    {headerName: 'Fecha/hora creacion', field: 'fecharegistropesca', resizable: true, sortable: true, filter: 'agDateColumnFilter', width: 160, filterParams: {
      comparator: function(filterLocalDateAtMidnight:any, cellValue:any) {
          var dateParts = cellValue.split(' ')[0].split('-');
          var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));

          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) return 0;
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
        }
    } ,  floatingFilter: true ,minWidth: 150 , cellStyle: {fontSize: '11px'} , editable: false,  cellRenderer: DateboxRendererComponent,  cellEditor: DateboxEditorComponent},

    //{ headerName: 'Estado', field: 'estado' ,  width: 100 }
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

    /*this.gridApi.forEachNode(function(node) { 
      console.log('data ag-grid',node.data);
    });*/
    
    /*
    setTimeout(()=>{
        this.gridApi.redrawRows();  //refreshCells(params);
        //this.gridApi.sizeColumnsToFit(); //params.api.
        this.gridApi.setPinnedBottomRowData([
          { id: '', proveedor: 'TOTAL (Libras)' , sector: this.librastotales , piscina: ''   }
        ]);  
      }, 1000)    
    */
         
     // params.api.setPinnedBottomRowData(this.createFooterData(params.api))
  }

  overlayLoadingTemplate ='<span class="ag-overlay-loading-center">Cargando su informacion...</span>';
 
    gridOptions1 = {
      columnDefs: this.columnDefs,
      rowData: this.rowData,
      defaultColDef: this.defaultColDef,
      //onFirstDataRendered: this.headerHeightSetter,
      //onColumnResized: this.headerHeightSetter,
    };

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
 


  suma(values:any, col:any) {
      var sum = 0;
      values.forEach( function(value:any) {sum += value.data[col]} );
      return sum;
  }
  
  createFooterData(gridApi:any) {
    var result = [];
    var model;
    var visibleRows = [];
    if(gridApi){
      model = gridApi.getModel();
      visibleRows = model.rowsToDisplay;
    }
    console.log('model:', model);
    console.log('visibleRows:', visibleRows);  
    result.push({
      id: null,
      proveedor: null,
      sector:null,
      piscina:null,
      cantidadprogramada: this.suma(visibleRows, 'cantidadprogramada'),
      //c: this.suma(visibleRows, 'c'),
      //d: this.suma(visibleRows, 'd'),
      //e: this.suma(visibleRows, 'e'),
      //f: this.suma(visibleRows, 'f'),
    });
    console.log('result:', result);
    return result;
  }  

  frameworkComponents: any;

  constructor(public loadingController: LoadingController, public modalController: ModalController,
    public toastController: ToastController, public alertController: AlertController,
    private servicePlanificacionAguaje: PlanificacionaguajeService , 
    private servicePlanificacionPrograma: PlanificacionprogramaService ,
    ) {
    this.objeto         = new planificacionProgramaCabecera();
    this.objetodetalle  = new planificacionProgramaDetalle();
    this.listMetodocosecha = [];
    this.noRowsTemplate = `<span>No existe Información a Mostrar</span>`;
    this.frameworkComponents = {
       checkboxRenderer: CheckboxsinoComponent,
       checkboxRendererNormal : CheckboxnormalComponent,
       textbuttonRenderer: TextbuttonComponent
    }
    this.rowClassRules = {
      'pesca-estado-anulada': function (params:any) {       
        return params.data.estado === 0
      },
      'pesca-estado-activa': function (params:any) { 
        return params.data.estado === 1 
      },      
      //'sick-days-breach': '!!data.idempleadoseguridad',
    };
    this.getDatos();
  }

  ngOnInit() {
    this.components = { datePicker: this.getDatePicker() };
  }

  async aplicaCierre(data:any){
    console.log('data.event.target.checked->' , data.event.target.checked);

  }


  async asignaSectorDetalle(item:any){
    console.log('item.event.target.value->' , item.event.target.value);
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getSector().then(async (respuesta:any) => {
          console.log('lista sectores' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Sectores', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              //this.objetodetalle.idsector  = (<any>data).id
              //this.objetodetalle.sector    = (<any>data).descripcion  
              
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
              //var rowNode:any = this.agGrid.api.getRowNode((<any>item).rowData.id);
              console.log('rowNode ->' , rowNode);
              console.log('rowNode.data->' , rowNode.data);
              rowNode.setDataValue('sector', (<any>data).descripcion);
              console.log(' sector escogido ->' ,  (<any>data).descripcion);
              console.log('rowNode.data actualizado->' , rowNode.data);

              //console.log('this.gridApi.getSelectedNodes()->' , this.gridApi.getSelectedNodes());
              
              //let sector = (<any>data).descripcion;
              //https://www.ag-grid.com/angular-data-grid/row-selection/
              /*let nodesToUpdate = this.gridApi.getSelectedNodes();
              nodesToUpdate.forEach((node) => {
                node.updateData({ ...node.data, sector });
              }); */

              /*
              this.gridApi.forEachNode((rowNode) => {
                const updated = rowNode.data;
                updated.sector = sector;
                // directly update data in rowNode
                rowNode.updateData(updated);
              });*/
              

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idsector';  
              objeto.valor = (<any>data).id;
              console.log('objeto' , objeto)
        
              //if(event.newValue != ''){
                console.log('entra al proceso de update sector' )
                this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto actualizado->' , data);
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

  async asignaSectorClienteDetalle(item:any){
    console.log('item.event.target.value->' , item.event.target.value);
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getSector().then(async (respuesta:any) => {
          console.log('lista sectores' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Sectores', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              //this.objetodetalle.idsector  = (<any>data).id
              //this.objetodetalle.sector    = (<any>data).descripcion  
              
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
              //var rowNode:any = this.agGrid.api.getRowNode((<any>item).rowData.id);
              console.log('rowNode ->' , rowNode);
              console.log('rowNode.data->' , rowNode.data);
              rowNode.setDataValue('sectorcliente', (<any>data).descripcion);
              console.log(' sector escogido ->' ,  (<any>data).descripcion);
              console.log('rowNode.data actualizado->' , rowNode.data);

              //console.log('this.gridApi.getSelectedNodes()->' , this.gridApi.getSelectedNodes());
             
              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idsectorcliente';  
              objeto.valor = (<any>data).id;
              console.log('objeto' , objeto)
        
              //if(event.newValue != ''){
                console.log('entra al proceso de update sector' )
                this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto actualizado->' , data);
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


  async asignaClienteDetalle(item:any){
    
    if(this.objeto.idproveedorpropiedad == 0){
      this.showMessage("Debe seleccionar un Origen de Pesca", "middle", "danger");
      return;
    }

    console.log('item ->' , item );

    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getClientes().then(async (respuesta:any) => {
          console.log('lista cliente' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Clientes', <any>respuesta, ["ruc","etiqueta","descripcion"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
            
              console.log('rowNode ->' , rowNode);
              console.log('rowNode.data->' , rowNode.data);
              rowNode.setDataValue('cliente', (<any>data).etiqueta);
              console.log(' cliente escogido ->' ,  (<any>data).descripcion);
              console.log('rowNode.data actualizado->' , rowNode.data);
              //console.log(' sector escogido ->' ,  (<any>data).descripcion);

              let objeto = {id :0 , idprogramapesca: 0 , idproveedor : 0 , 
                  idcliente: 0 , fechadespacho: '' , idtipoproceso: 0 , idaguaje: 0 ,
                   idusuario: 0 , idproveedorpropiedad: 0 , idcomprador :0 , quimico: false};
              objeto.id               =   rowNode.data.id; 
              objeto.idprogramapesca  =   rowNode.data.idprogramapesca;  
              objeto.idcliente        =   (<any>data).id;  
              objeto.idproveedor      =   rowNode.data.idproveedor;
              objeto.fechadespacho    =   rowNode.data.fechadespacho;
              objeto.idtipoproceso    =   rowNode.data.idtipoproceso;
              objeto.idaguaje         =   this.objeto.idaguaje;
              objeto.idproveedorpropiedad = this.objeto.idproveedorpropiedad;
              objeto.idusuario        =   this.servicePlanificacionPrograma.userService.usuario.id;  
              objeto.idcomprador      =   rowNode.data.idcomprador;
              objeto.quimico          =   this.objeto.quimico;
              console.log('objeto a enviar' , objeto)
        
              //if(event.newValue != ''){                 
                this.servicePlanificacionPrograma.postUpdateCabecera(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto proveedor actualizado->' , data);
                  if(this.objeto.idcliente == 0) {
                    this.cargaDatosDetalleAguaje();
                  }else{
                    this.cargaDatosDetalleAguajeCliente();
                  }
                  
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


  async asignaMuelleDetalle(item:any){
    console.log('item.event.target.value->' , item.event.target.value);
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getMuelle().then(async (respuesta:any) => {
          console.log('lista muelle' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Muelles', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              //this.objetodetalle.idsector  = (<any>data).id
              //this.objetodetalle.sector    = (<any>data).descripcion  
              
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
              //var rowNode:any = this.agGrid.api.getRowNode((<any>item).rowData.id);
              console.log('rowNode ->' , rowNode);
              console.log('rowNode.data->' , rowNode.data);
              rowNode.setDataValue('muelle', (<any>data).descripcion);
              console.log(' sector escogido ->' ,  (<any>data).descripcion);
              console.log('rowNode.data actualizado->' , rowNode.data);

              //console.log('this.gridApi.getSelectedNodes()->' , this.gridApi.getSelectedNodes());
             
              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idmuelle';  
              objeto.valor = (<any>data).id;
              console.log('objeto' , objeto)
        
              //if(event.newValue != ''){
                console.log('entra al proceso de update muelle' )
                this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto actualizado->' , data);
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
 
  async asignaPiscinaDetalle(item:any){
    console.log('item ->' , item );
    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getPiscina().then(async (respuesta:any) => {
          console.log('lista Piscina' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Piscina', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              //this.objetodetalle.idsector  = (<any>data).id
              //this.objetodetalle.sector    = (<any>data).descripcion  
              
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
              //var rowNode:any = this.agGrid.api.getRowNode((<any>item).rowData.id);
              console.log('rowNode ->' , rowNode);
              console.log('rowNode.data->' , rowNode.data);
              rowNode.setDataValue('piscina', (<any>data).descripcion);

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idpiscina';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
        
              //if(event.newValue != ''){
                this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto piscina actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
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


  async asignaSociedadDetalle(item:any){
    console.log('item ->' , item );
    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getSociedad().then(async (respuesta:any) => {
          console.log('lista Sociedad' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Sociedad', <any>respuesta, ["nombre"]).then(data => {
            if(!!data){
              //this.objetodetalle.idsector  = (<any>data).id
              //this.objetodetalle.sector    = (<any>data).descripcion  
              
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
              //var rowNode:any = this.agGrid.api.getRowNode((<any>item).rowData.id);
              console.log('rowNode ->' , rowNode);
              console.log('rowNode.data->' , rowNode.data);
              rowNode.setDataValue('sociedad', (<any>data).nombre);

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idsociedad';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
        
              //if(event.newValue != ''){
                this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto piscina actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
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


  async asignaMetodoCosechaDetalle(item:any){
    console.log('item ->' , item );
    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getMetodoCosecha().then(async (respuesta:any) => {
          console.log('lista metodo cosecha' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Metodo Cosecha', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              //this.objetodetalle.idsector  = (<any>data).id
              //this.objetodetalle.sector    = (<any>data).descripcion  
              
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
              //var rowNode:any = this.agGrid.api.getRowNode((<any>item).rowData.id);
              console.log('rowNode ->' , rowNode);
              console.log('rowNode.data->' , rowNode.data);
              rowNode.setDataValue('metodocosecha', (<any>data).descripcion);

              let objeto = {id :0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idmetodocosecha';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
        
              //if(event.newValue != ''){
                this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto metodocosecha actualizado->' , data);
                  this.gridApi.redrawRows();
                })  
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


  async asignaProveedorDetalle(item:any){

    if(this.objeto.idproveedorpropiedad == 0){
      this.showMessage("Debe seleccionar un Origen de Pesca", "middle", "danger");
      return;
    }
    console.log('item ->' , item );

    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getProveedorCamaronByIdPropiedad(this.objeto.idproveedorpropiedad).then(async (respuesta:any) => {
          console.log('lista proveedor camaron segun propiedad' , respuesta)
          this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Proveedores', <any>respuesta, ["descripcion","direccion"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);
            
              rowNode.setDataValue('proveedor', (<any>data).descripcion);
              //console.log(' sector escogido ->' ,  (<any>data).descripcion);

              let objeto = {id :0 , idprogramapesca: 0 , idproveedor : 0 , 
                  idcliente: 0 , fechadespacho: '' , idtipoproceso: 0 , idaguaje: 0 ,
                   idusuario: 0 , idproveedorpropiedad: 0 , idcomprador :0 , quimico: false};
              objeto.id               =   rowNode.data.id; 
              objeto.idprogramapesca  =   rowNode.data.idprogramapesca;  
              objeto.idcliente        =   rowNode.data.idcliente;  
              objeto.idproveedor      =   (<any>data).id;
              objeto.fechadespacho    =   rowNode.data.fechadespacho;
              objeto.idtipoproceso    =   rowNode.data.idtipoproceso;
              objeto.idaguaje         =   this.objeto.idaguaje;
              objeto.idproveedorpropiedad = this.objeto.idproveedorpropiedad;
              objeto.idusuario        =   this.servicePlanificacionPrograma.userService.usuario.id;  
              objeto.idcomprador      =   rowNode.data.idcomprador;
              objeto.quimico          =   this.objeto.quimico;
              console.log('objeto a enviar' , objeto)
        
              //if(event.newValue != ''){                 
                this.servicePlanificacionPrograma.postUpdateCabecera(objeto).then(async data => {
                  //this.objeto = <any>data
                  console.log('objeto proveedor actualizado->' , data);
                  if(this.objeto.idcliente == 0) {
                    this.cargaDatosDetalleAguaje();
                  }else{
                    this.cargaDatosDetalleAguajeCliente();
                  }
                  
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

  generatePinnedBottomData(){
    // generate a row-data with null values
    let result:any = {};

    this.gridColumnApi.getAllGridColumns().forEach( (item:any) => {
        result[item.colId] = null;
    });
    return this.calculatePinnedBottomData(result);
  }


  /* */
  calculatePinnedBottomData(target: any){
    //console.log(target);
    //list of columns fo aggregation
    let columnsWithAggregation = ['cantidadprogramada'] //,'gold','silver'
    columnsWithAggregation.forEach(element => {
      console.log('element', element);
        this.gridApi.forEachNodeAfterFilter((rowNode ) => {
          //if(rowNode.index < 10){
            //console.log(rowNode);
          //}
            if (rowNode.data[element])
                target[element] += Number(rowNode.data[element].toFixed(2));
        });
        if (target[element])
            target[element] = `${target[element].toFixed(2)}`;
    })
    //console.log(target);
    target['proveedor'] = 'Total';
    return target;
  }
 
  onTipoProcesoSelected(){
		//console.log('idpuestotrabajo select evento->', evento); 
    if(this.objeto.idtipoproceso == 1){
      this.objeto.quimico = false;
      console.log('quimico es false ->' , this.objeto.quimico); 
    }
  }

  async getDatos(){ 
    try {
      await this.presentLoading();
      /* 
      await this.servicePlanificacionAguaje.getAll().then((respuesta:any) => {
        console.log('lista aguaje' , respuesta)
        this.listAguaje=respuesta
      })*/

      await this.servicePlanificacionPrograma.getTipoProceso().then((respuesta:any) => {
        console.log('listTipoProceso' , respuesta)
        this.listTipoProceso=respuesta
      }) 

      await this.servicePlanificacionPrograma.getProveedorPropiedad().then((respuesta:any) => {
        console.log('listPropiedad' , respuesta)
        this.listPropiedad=respuesta
      }) 
      
      /*
      await this.servicePlanificacionPrograma.getProveedor().then((respuesta:any) => {
        console.log('listProveedor' , respuesta)
        this.listProveedor=respuesta
      }) */ 

      await this.servicePlanificacionPrograma.getComprador().then((respuesta:any) => {
        console.log('listComprador' , respuesta)
        this.listComprador=respuesta
      }) 

      /*
      await this.servicePlanificacionPrograma.getSector().then((respuesta:any) => {
        console.log('listSector' , respuesta)
        this.listSector=respuesta
      })*/ 
       
      await this.servicePlanificacionPrograma.getCampamento().then((respuesta:any) => {
        console.log('listCampamento' , respuesta)
        this.listCampamento=respuesta
      })
      
      await this.servicePlanificacionPrograma.getMetodoCosecha().then((respuesta:any) => {
        console.log('listMetodocosecha' , respuesta)
        this.listMetodocosecha=respuesta
      })
    
      await this.servicePlanificacionPrograma.getPiscina().then((respuesta:any) => {
        console.log('listPiscina' , respuesta)
        this.listPiscina=respuesta
      })
      
      /*
      await this.servicePlanificacionPrograma.getClientes().then((respuesta:any) => {
        console.log('listclientes' , respuesta)
        this.listClientes=respuesta
      })*/

    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    } finally {
      this.closeLoading() 
    }
  }

  filtrarDatos(){

  }

  setTotales(){

    let total = 0;
    this.librastotales = 0;

    if(!!this.agGrid && !!this.agGrid.api){
      let totalFiltrado=0
      this.librastotales = 0;
      this.agGrid.api.forEachNode(function(rowNode, index) { //forEachNodeAfterFilter
        //console.log(rowNode)
        totalFiltrado += Number(rowNode.data.cantidadprogramada)
      });
      this.librastotales = totalFiltrado
    }
    this.bottomData = [{ id: '', proveedor: 'TOTAL (Libras)' , sector: this.librastotales , piscina: '' }]

  }

  async nuevo(){
    this.objeto         = new planificacionProgramaCabecera();
    this.objetodetalle  = new planificacionProgramaDetalle();
    this.rowData = [];
    //this.librastotales = 36678;
    this.librastotales  = 0;
    this.librasaguaje   = 0;
  }

  


  async buscarAguaje(){ //['numeroaguaje','descripcion','anio'], ""
    try {

      await this.presentLoading();

      await this.servicePlanificacionAguaje.getAll().then( async (respuesta:any) => {
        console.log('lista aguaje' , respuesta)
         this.closeLoading();
        
        /* 
        let objetoBuscado=null;
        if ((<any>respuesta).length >= 1){
          if ((<any>respuesta).length == 1){
            objetoBuscado = respuesta[0]; 
          } 
          else{
            let listabusqueda = [];
            for (let item of <any>respuesta) { 
              //console.log('item->',item);
              listabusqueda.push(item);
            }
            await this.mostrarFormularioBusqueda('Seleccione un Aguaje', listabusqueda, ['numeroaguaje'], "").then(data2 => {
              if(respuesta != null) objetoBuscado = (<any>data2)
            })
          }
        } else 
          throw Error("No se encontraron registros con los datos proporcionados") 

        if ( objetoBuscado != null){
          this.objeto.idaguaje  = objetoBuscado.id
          this.objeto.aguaje    = objetoBuscado.numeroaguaje + '-' + objetoBuscado.descripcion + '-' + objetoBuscado.anio
          
        }*/
        
        await this.mostrarFormularioBusqueda('Lista de Aguajes', <any>respuesta, ["numeroaguaje","descripcion","anio"]).then(async data => {
          if(!!data){
            this.objeto.idaguaje  = (<any>data).id
            this.objeto.aguaje    = (<any>data).numeroaguaje + '-' + (<any>data).descripcion + '-' + (<any>data).anio

            //cargo los datos detalles del aguaje escogido

              //limpiar objetos                
              this.objetodetalle  = new planificacionProgramaDetalle();
              this.librastotales = 0;
              this.librasaguaje = 0;
              //consultar datos cabecera y detalle 
              let detalle:any = [];
 
              await this.servicePlanificacionPrograma.getProgramaByIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
                console.log('list (<any>respuesta)' , (<any>respuesta))
                if((<any>respuesta).length > 0){
                  //this.objeto = respuesta[0]; // ya no asigno la cabecera , solo se usa para crear 
                  //this.rowData = respuesta[0].detalle;
                  this.rowData = (<any>respuesta);
                  
                    console.log('detalle lleno' , (<any>respuesta) )
                    detalle = (<any>respuesta) 
                    for(let item of  detalle ){
                      //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                      if(item.estado === 1){
                        this.librastotales +=  (item.cantidadprogramada);   
                        this.librasaguaje +=  (item.librasaguaje);  
                      }  
                    }
              
                    console.log('librastotales  ' ,  this.librastotales )
          
                }else{
                  this.rowData = [];
                  this.librastotales = 0;
                }
                
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


  async buscarCliente(){  
    if(this.objeto.idaguaje == 0){
      this.showMessage("Debe seleccionar un Aguaje", "middle", "danger");
      return;
    }
    try {
        await this.presentLoading();

        await this.servicePlanificacionPrograma.getClientes().then(async (respuesta:any) => {
          console.log('lista clientes' , respuesta)
           this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Clientes', <any>respuesta, ["ruc","descripcion","etiqueta"]).then(async data => {
            if(!!data){
              this.objeto.idcliente  = (<any>data).id
              this.objeto.cliente    = (<any>data).ruc + '-' + (<any>data).etiqueta  

              //cargo los datos del aguaje y del cliente

              //limpiar objetos                
              this.objetodetalle  = new planificacionProgramaDetalle();
              this.librastotales = 0;
              this.librasaguaje = 0;
              //consultar datos cabecera y detalle 
              let detalle:any = [];
 
              await this.servicePlanificacionPrograma.getProgramabyIdAguajeAndIdCliente(this.objeto.idaguaje , this.objeto.idcliente).then( async (respuesta:any) => {
                console.log('list cabecera' , respuesta)
                console.log('list (<any>respuesta)' , (<any>respuesta))
                if((<any>respuesta).length > 0){
                  //this.objeto = respuesta[0]; // ya no asigno la cabecera , solo se usa para crear 
                  //this.rowData = respuesta[0].detalle;
                  this.rowData = (<any>respuesta);
                  
                    console.log('detalle lleno' , (<any>respuesta) )
                    detalle = (<any>respuesta) 
                    for(let item of  detalle ){
                      //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                      if(item.estado === 1){
                        this.librastotales +=  (item.cantidadprogramada);   
                        this.librasaguaje +=  (item.librasaguaje);  
                      }
                    }
              
                    console.log('librastotales  ' ,  this.librastotales )
          
                }else{
                  this.rowData = [];
                  this.librastotales = 0;
                }
                
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

  async buscarPorFechaDespacho(dato:any, campo:any, evento:any){  
    if(this.objeto.idaguaje == 0){
      this.showMessage("Debe seleccionar un Aguaje", "middle", "danger");
      return;
    }

    /*
    if(this.objeto.idcliente == 0){
      this.showMessage("Debe seleccionar un Cliente", "middle", "danger");
      return;
    }*/

    console.log('dato->',dato)
    console.log('campo->',campo)
    console.log('evento value->',evento.detail.value)
    console.log('fecha' , evento.detail.value.slice(0,10))

    
    console.log('this.objeto.fechadespacho' , this.objeto.fechadespacho)


    try {
          await this.presentLoading();

          //cargo los datos del aguaje y del cliente

          //limpiar objetos                
          this.objetodetalle  = new planificacionProgramaDetalle();
          this.librastotales = 0;
          this.librasaguaje = 0;
          //consultar datos cabecera y detalle 
          let detalle:any = [];
          
          //await this.servicePlanificacionPrograma.getProgramabyIdAguajeAndIdClienteAndFechaDespacho(this.objeto.idaguaje , this.objeto.idcliente , evento.detail.value.slice(0,10)).then( async (respuesta:any) => {
            await this.servicePlanificacionPrograma.getProgramabyIdAguajeAndFechaDespacho(this.objeto.idaguaje ,  evento.detail.value.slice(0,10)).then( async (respuesta:any) => {
            this.closeLoading();
            console.log('list cabecera' , respuesta)
            console.log('list (<any>respuesta)' , (<any>respuesta))
            if((<any>respuesta).length > 0){
              //this.objeto = respuesta[0]; // ya no asigno la cabecera , solo se usa para crear 
              //this.rowData = respuesta[0].detalle;
              this.rowData = (<any>respuesta);
              
                console.log('detalle lleno' , (<any>respuesta) )
                detalle = (<any>respuesta) 
                for(let item of  detalle ){
                  //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                  if(item.estado === 1){
                    this.librastotales +=  (item.cantidadprogramada);   
                    this.librasaguaje +=  (item.librasaguaje);  
                  }
                }
          
                console.log('librastotales  ' ,  this.librastotales )
      
            }else{
              this.rowData = [];
              this.librastotales = 0;
              //cargar con los datos de aguaje y cliente nomas
              this.showMessage("No existen datos para la fecha de despacho seleccionada.. cargando datos de Aguaje ", "middle", "warning");
              let detalle:any = [];
 
              //await this.servicePlanificacionPrograma.getProgramabyIdAguajeAndIdCliente(this.objeto.idaguaje , this.objeto.idcliente).then( async (respuesta:any) => {
                await this.servicePlanificacionPrograma.getProgramaByIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => { 
              console.log('list cabecera' , respuesta)
                console.log('list (<any>respuesta)' , (<any>respuesta))
                if((<any>respuesta).length > 0){
                  //this.objeto = respuesta[0]; // ya no asigno la cabecera , solo se usa para crear 
                  //this.rowData = respuesta[0].detalle;
                  this.rowData = (<any>respuesta);
                  
                    console.log('detalle lleno' , (<any>respuesta) )
                    detalle = (<any>respuesta) 
                    for(let item of  detalle ){
                      //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                      if(item.estado === 1){
                        this.librastotales +=  (item.cantidadprogramada);   
                        this.librasaguaje +=  (item.librasaguaje);  
                      }
                    }
              
                    console.log('librastotales  ' ,  this.librastotales )
          
                }else{
                  this.rowData = [];
                  this.librastotales = 0;
                }
                
              }) 


            }
            
          }) 

      } catch (error) {
        //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
        console.log('error es ',error)
        this.showMessage(error, "middle", "danger",1000)
      } finally { 
        this.closeLoading() 
      }  

  }  

  async buscarProveedor(){  
    if(this.objeto.idproveedorpropiedad == 0){
      this.showMessage("Debe seleccionar un Origen de Pesca", "middle", "danger");
      return;
    }
    try {
        await this.presentLoading();

        await this.servicePlanificacionPrograma.getProveedorCamaronByIdPropiedad(this.objeto.idproveedorpropiedad).then(async (respuesta:any) => {
          console.log('lista proveedor camaron segun propiedad' , respuesta)
           this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Proveedores', <any>respuesta, ["descripcion","direccion"]).then(data => {
            if(!!data){
              this.objeto.idproveedor  = (<any>data).id
              this.objeto.proveedor    = (<any>data).descripcion   
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

  async buscarSector(){  
    
    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getSector().then(async (respuesta:any) => {
          console.log('lista sectores' , respuesta)
           this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Sectores', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              this.objetodetalle.idsector  = (<any>data).id
              this.objetodetalle.sector    = (<any>data).descripcion  
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

  async buscarPiscina(){  
    
    try {
        await this.presentLoading();
        
        await this.servicePlanificacionPrograma.getPiscina().then(async (respuesta:any) => {
          console.log('lista sectores' , respuesta)
           this.closeLoading();

          await this.mostrarFormularioBusqueda('Lista de Piscina', <any>respuesta, ["descripcion"]).then(data => {
            if(!!data){
              this.objetodetalle.idpiscina  = (<any>data).id
              this.objetodetalle.piscina    = (<any>data).descripcion  
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


  async cargaDatosDetalleAguajeCliente(){

    try {
      await this.presentLoading();
          //limpiar objetos                
          this.objetodetalle  = new planificacionProgramaDetalle();
          this.librastotales = 0;
          this.librasaguaje = 0;
          //consultar datos cabecera y detalle 
          let detalle:any = [];

          await this.servicePlanificacionPrograma.getProgramabyIdAguajeAndIdCliente(this.objeto.idaguaje , this.objeto.idcliente).then( async (respuesta:any) => {
            console.log('list datos' , respuesta)
            if(respuesta.length > 0){
              //this.objeto = respuesta[0];
              //this.rowData = respuesta[0].detalle;
              this.rowData = respuesta;

                console.log('detalle lleno' , respuesta )
                detalle = respuesta
                for(let item of  detalle ){
                  //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                  if(item.estado === 1){
                    this.librastotales +=  (item.cantidadprogramada);   
                    this.librasaguaje +=  (item.librasaguaje);  
                  }

                }
          
                console.log('librastotales  ' ,  this.librastotales )
      
            }else{
              this.rowData = [];
              this.librastotales = 0;
            }
            
          }) 
        } catch (error) {
          //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
          console.log('error es ',error)
          this.showMessage(error, "middle", "danger",1000)
        } finally { 
           this.closeLoading() 
        }  

  }


  async cargaDatosDetalleAguaje(){

    try {
      await this.presentLoading();
          //limpiar objetos                
          this.objetodetalle  = new planificacionProgramaDetalle();
          this.librastotales = 0;
          this.librasaguaje = 0;
          //consultar datos cabecera y detalle 
          let detalle:any = [];

          await this.servicePlanificacionPrograma.getProgramaByIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
            console.log('list datos por aguaje' , respuesta)
            if(respuesta.length > 0){
              //this.objeto = respuesta[0];
              //this.rowData = respuesta[0].detalle;
              this.rowData = respuesta;

                console.log('detalle lleno' , respuesta )
                detalle = respuesta
                for(let item of  detalle ){
                  //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                  if(item.estado === 1){
                    this.librastotales +=  (item.cantidadprogramada);   
                    this.librasaguaje +=  (item.librasaguaje);  
                  }
                }
          
                console.log('librastotales  ' ,  this.librastotales )
      
            }else{
              this.rowData = [];
              this.librastotales = 0;
            }
            
          }) 
        } catch (error) {
          //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
          console.log('error es ',error)
          this.showMessage(error, "middle", "danger",1000)
        } finally { 
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
    //console.log('sin actualizar ...' , event.column.colId); 
    //if(event.column.colId=="fechamaterialescampo" || event.column.colId=="fechaconfirmacionpesca" || event.column.colId=="fechaarriboplanta"){
    console.log('event.column.colId ->' , event.column.colId); 
    let proveedor =    event.column.colId.replace(/\s+/g, ''); 
    console.log('proveedor ->' , proveedor); 
    if( !(event.column.colId=="sector")  || ( proveedor !="proveedor" ) ){
      let objeto = {id :0 , campo: '' , valor : ''};
      objeto.id =   event.data.id;  
      objeto.campo = event.column.colId;  
      objeto.valor = event.newValue;
      console.log('objeto' , objeto)
      console.log('event.newValue' , event.newValue)

      //if(event.newValue != ''){
        console.log('entra al proceso de update' )
        this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async data => {
          //this.objeto = <any>data
          console.log('objeto dev->' , data);
        })  
      }  

    //}

  }


  async guardar(){
   /* */
    if(this.objeto.idaguaje == 0) {
      this.showMessage('Seleccione un Numero de Aguaje', "middle", "danger")
      return;
    }

    if(this.objeto.idcliente == 0) {
      this.showMessage('Seleccione un Cliente', "middle", "danger")
      return;
    }

    if(this.objeto.idproveedorpropiedad == 0) {
      this.showMessage('Seleccione un Origen de Pesca', "middle", "danger")
      return;
    }

    if(this.objeto.idproveedor == 0) {
      this.showMessage('Seleccione un Proveedor', "middle", "danger")
      return;
    }

    if(this.objeto.idtipoproceso == 0) {
      this.showMessage('Seleccione un Proceso', "middle", "danger")
      return;
    }

    if(this.objetodetalle.idcampamento == 0) {
      this.showMessage('Seleccione un Campamento', "middle", "danger")
      return;
    }

    console.log('this.objeto.fechadespacho' , this.objeto.fechadespacho)
    console.log('this.objeto.idtipoproceso' , this.objeto.idtipoproceso)

    /*  */
    console.log('usuario session ' , this.servicePlanificacionPrograma.userService.usuario)
    console.log('usuario ID ' , this.servicePlanificacionPrograma.userService.usuario.id)
    this.objeto.idusuario = this.servicePlanificacionPrograma.userService.usuario.id;  

    await this.presentLoading();
    //this.usuario["plataforma"] = this.platform.platforms().toString();
    this.objeto.objetodetalle = this.objetodetalle;
    this.servicePlanificacionPrograma.post(this.objeto).then(async (resp:any) => {
       console.log('respuesta',resp) ;      
      //this.getDatos();         
      //this.nuevo();   
      //this.onAguajeSelected();
      this.cargaDatosDetalleAguajeCliente();
      this.showMessage("Datos guardados con éxito", "middle", "success");  
    
    }).catch((error:any) => {
      console.log(error)
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }).finally( () => {
      this.closeLoading();
    }) 
   
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
          this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async (resp:any) => {
            console.log('respuesta',resp) ;      
           //this.getDatos();   
            //recargo los datos detalles del aguaje escogido

              //limpiar objetos                
              this.objetodetalle  = new planificacionProgramaDetalle();
              this.librastotales = 0;
              this.librasaguaje = 0;
              //consultar datos cabecera y detalle 
              let detalle:any = [];
 
              await this.servicePlanificacionPrograma.getProgramaByIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
                console.log('list (<any>respuesta)' , (<any>respuesta))
                if((<any>respuesta).length > 0){
                  //this.objeto = respuesta[0]; // ya no asigno la cabecera , solo se usa para crear 
                  //this.rowData = respuesta[0].detalle;
                  this.rowData = (<any>respuesta);
                  
                    console.log('detalle lleno' , (<any>respuesta) )
                    detalle = (<any>respuesta) 
                    for(let item of  detalle ){
                      //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                      if(item.estado === 1){
                        this.librastotales +=  (item.cantidadprogramada);   
                        this.librasaguaje +=  (item.librasaguaje);  
                      }
                    }
              
                    console.log('librastotales del ' ,  this.librastotales )
          
                }else{
                  this.rowData = [];
                  this.librastotales = 0;
                }
                
              })          
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


  async activar(item:any){
    console.log('item activar seleccionado ->',item)

    this.presentAlertConfirm('Atencion', 'Esta seguro que desea Activar el registro ?').then(async resp => {
      if(resp){
        
        try {
          await this.presentLoading();
          let objeto = {id :0 , campo: '' , valor : 0};
          objeto.id =   item.id;  
          objeto.campo = "estado";  
          objeto.valor = 1;
          this.servicePlanificacionPrograma.postUpdateDetalle(objeto).then(async (resp:any) => {
            console.log('respuesta',resp) ;      
           //this.getDatos();   
            //recargo los datos detalles del aguaje escogido

              //limpiar objetos                
              this.objetodetalle  = new planificacionProgramaDetalle();
              this.librastotales = 0;
              this.librasaguaje = 0;
              //consultar datos cabecera y detalle 
              let detalle:any = [];
 
              await this.servicePlanificacionPrograma.getProgramaByIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
                console.log('list (<any>respuesta)' , (<any>respuesta))
                if((<any>respuesta).length > 0){
                  //this.objeto = respuesta[0]; // ya no asigno la cabecera , solo se usa para crear 
                  //this.rowData = respuesta[0].detalle;
                  this.rowData = (<any>respuesta);
                  
                    console.log('detalle lleno' , (<any>respuesta) )
                    detalle = (<any>respuesta) 
                    for(let item of  detalle ){
                      //console.log('item.cantidadprogramada' , item.cantidadprogramada )
                      if(item.estado === 1){
                        this.librastotales +=  (item.cantidadprogramada);   
                        this.librasaguaje +=  (item.librasaguaje);  
                      }
                    }
              
                    console.log('librastotales del ' ,  this.librastotales )
          
                }else{
                  this.rowData = [];
                  this.librastotales = 0;
                }
                
              })          
           this.showMessage("Datos Activados con éxito", "middle", "success");  
         
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

  async excelExportar(){


    if(this.objeto.idaguaje == 0) {
      this.showMessage('Seleccione un Numero de Aguaje', "middle", "danger")
      return;
    }

    let datos:any = []; 

    await this.servicePlanificacionPrograma.getPlanificacionprogramaByIdAguaje(this.objeto.idaguaje).then(async (respuesta:any) => {
      console.log('datos' , respuesta)
        datos=respuesta
    }) 

    if( datos.length == 0) {
      this.showMessage('No existe informacion asociada al Aguaje seleccionado', "middle", "danger")
      return;
    }

     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'ListaAguajeDetalle');
     XLSX.writeFile(wb, 'ListaAguajeDetalle' + '.xlsx');
  
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



    extractValues(mappings:any) {
    return Object.keys(mappings); //Object.keys(mappings);
    }
    
    alookupValue(mappings:any, key:any) {
        return mappings[key];
    }
    
    alookupKey(mappings:any, name:any) {
        for (var key in mappings) {
            if (mappings.hasOwnProperty(key)) {
                if (name === mappings[key]) {
                    return key;
                }
            }
        }
    }

    lookupValue2(mappings: Record<string, string>, key: string) {
      return mappings[key];
    }

    lookupValue(mappings: any, key: string) {
      return (mappings[key]).descripcion;
    }
    
    lookupKey(mappings: Record<string, string>, name: string) {
      const keys = Object.keys(mappings);
    
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
    
        if (mappings[key] === name) {
          return key;
        }
      }
    }


  /*
   getDatePicker() {
    function Datepicker() {}
    Datepicker.prototype.init = function(params:any) {
      this.eInput = document.createElement("input");
      this.eInput.value = params.value;
      this.eInput.classList.add('ag-input');
      this.eInput.style.height = 'var(--ag-row-height)';
      this.eInput.style.fontSize = 'calc(var(--ag-font-size) + 1px)';
      $(this.eInput).datepicker({ dateFormat: "dd/mm/yy" });
    };
    Datepicker.prototype.getGui = function() {
      return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function() {
      this.eInput.focus();
      this.eInput.select();
    };
    Datepicker.prototype.getValue = function() {
      return this.eInput.value;
    };
    Datepicker.prototype.destroy = function() {};
    Datepicker.prototype.isPopup = function() {
      return false;
    };
    return Datepicker;
  } */

  getDatePicker() {
    function Datepicker() {}
    Datepicker.prototype.init = function(params:any) {
      this.eInput = document.createElement("input");
      this.eInput.value = params.value;
      this.eInput.type = 'date';
      //$(this.eInput).datetimepicker({ dateFormat: "dd/mm/yy" });
    };
    Datepicker.prototype.getGui = function() {
      return this.eInput;
    };
    Datepicker.prototype.afterGuiAttached = function() {
      this.eInput.focus();
      this.eInput.select();
    };
    Datepicker.prototype.getValue = function() {
      return this.eInput.value;
    };
    Datepicker.prototype.destroy = function() {};
    Datepicker.prototype.isPopup = function() {
      return false;
    };
    return Datepicker;
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

}
