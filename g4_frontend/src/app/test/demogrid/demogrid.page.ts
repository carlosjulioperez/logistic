import { Component, OnInit, ViewChild , Injector } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular'; 
 
import { ButtonEditComponent } from 'src/app/components/button-edit/button-edit.component';
import { CellEditingStartedEvent,
  CellEditingStoppedEvent,
  ColDef,
  ICellRendererParams,
  RowEditingStartedEvent,
  RowEditingStoppedEvent, } from 'ag-grid-community';
import { DateinputComponent } from 'src/app/components/dateinput/dateinput.component';
import { DateboxEditorComponent } from 'src/app/components/datebox-editor/datebox-editor.component';
import { DateboxRendererComponent } from 'src/app/components/datebox-renderer/datebox-renderer.component';
import * as moment from 'moment';

@Component({
  selector: 'app-demogrid',
  templateUrl: './demogrid.page.html',
  styleUrls: ['./demogrid.page.scss'],
})
export class DemogridPage implements OnInit {

  //@ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('agGridOrden', {static:false}) agGridOrden!: AgGridAngular;
  private gridApi:any;
  private gridColumnApi:any;


  columnDefs: ColDef[] = [   
    {field: 'Editar', cellRenderer: ButtonEditComponent,
      cellRendererParams:{
        clicked: (field:any) =>{
          console.log('click def ')
          this.edit(field)
        }
      } , width: 100
    }, 
		{ headerName: 'Make', field: 'make' , resizable: true, width: 150 },
		{ headerName: 'Model', field: 'model' , resizable: true, width: 150 },
		{ headerName: 'Price', field: 'price' , resizable: true, width: 150 },
    { headerName: 'Fecha', field: 'fechacampo' , resizable: true, width: 180 , editable: true,
       cellRenderer: DateboxRendererComponent,
       //cellRenderer: 'dateboxEditorComponentRender',
      /* cellRenderer: (data:any) => {
        return moment(data.fechacampo).format('MM/DD/YYYY HH:mm')
      }, */
       cellEditor: DateboxEditorComponent, // DateinputComponent , 
       cellRendererParams: {
         /*
        demoo: (field:any) =>{
          console.log('  def ')
          this.selectFecha(field)
        }   */
      // onKeyDown : this.selectFecha.bind(this)
        //onClick : this.selectFecha.bind(this), //clicked  onClick  onClick : this.selectFecha.bind(this)
      }  
    }
	];

	rowData:any = [];
  lista:any = [];


  defaultColDef = {
    sortable: true,
    filter: true
  }

  gridOptions = {
    alignedGrids: [], //suppressHorizontalScroll: false, 
    alwaysShowHorizontalScroll: true,
    suppressRowClickSelection: true,
    enableRangeSelection: true,
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

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  frameworkComponents: any;

  constructor(private injector:Injector) {
    //super(injector);
    this.frameworkComponents = {
      dateboxEditorComponentRender: DateboxEditorComponent,  
    }
   }

  ngOnInit() {
    this.lista = [
      { make: 'Toyota', model: 'Celica', price: 35000 , fechacampo: '2023-07-15 14:25:16' },
      { make: 'Ford', model: 'Mondeo', price: 32000 , fechacampo: '2023-07-16' },
      { make: 'Porsche', model: 'Boxster', price: 72000 ,  fechacampo: '2023-07-16 16:10:09'}
    ];

    this.rowData = this.lista;
  }

  async selectFecha(data:any){
    console.log('data.event.target.value->' , data.event.target.value);

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

    if(event.column.colId=="fechacampo"){


      let objeto = {id :0 , campo: '' , valor : ''};
     
      objeto.id =   event.data.make;  
      objeto.campo = "origen"; //FORMATO
      objeto.valor = event.newValue;

      console.log('objeto' , objeto)

    }

  }

  edit(field:any){
    console.log('field ->',field)
  }

  mostrarCrud(){

  }

  updateFilter(event:any){     
      const val = event.target.value.toLowerCase();
      const temp = this.lista.filter(function(d:any) {
        return !val || d.make.toLowerCase().indexOf(val) !== -1 ;
      });
      this.rowData = temp;     
  }

}
