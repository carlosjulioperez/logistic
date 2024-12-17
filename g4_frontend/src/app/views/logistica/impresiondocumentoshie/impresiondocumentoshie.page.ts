import { Component, Injector , OnInit, ViewChild ,Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; 
import { LoadingController, ToastController, Platform, AlertController , ModalController } from '@ionic/angular';
import { ColDef, CellEditingStartedEvent,
  CellEditingStoppedEvent,  
  ICellRendererParams,
  RowEditingStartedEvent,  
  RowEditingStoppedEvent, ValueFormatterParams , GridApi } from 'ag-grid-community';
import { PlanificacionaguajeService } from 'src/app/api/logistica/planificacionaguaje.service';
import { planificacionProgramaCabecera } from 'src/app/model/PlanificacionPrograma';
import { ButtonFileComponent } from 'src/app/components/button-file/button-file.component';
import { ButtonGenerateComponent } from 'src/app/components/button-generate/button-generate.component';
import { ButtonPrintComponent } from 'src/app/components/button-print/button-print.component';
import { ButtonDeleteComponent } from 'src/app/components/button-delete/button-delete.component';
import * as FileSaver from 'file-saver';
import { VisualizadorPage } from '../../general/visualizador/visualizador.page';
import { guiaElectronica , guiaDetalle } from 'src/app/model/DocumentoSRI';
import { id } from 'date-fns/locale';
import { SearchPage } from 'src/app/search/search.page';
import { PlanificacionprogramaService } from 'src/app/api/logistica/planificacionprograma.service';
import { TextbuttonComponent } from 'src/app/components/textbutton/textbutton.component';
import { ButtonGenerateNativeComponent } from 'src/app/components/button-generate-native/button-generate-native.component';
import { LogisticadespachohieloService } from 'src/app/api/logistica/logisticadespachohielo.service';

@Component({
  selector: 'app-impresiondocumentoshie',
  templateUrl: './impresiondocumentoshie.page.html',
  styleUrls: ['./impresiondocumentoshie.page.scss'],
})
export class ImpresiondocumentoshiePage implements OnInit {

  loading:any
  listAguaje:any                  = [];
  listDetallePrograma:any         = [];
  objeto:planificacionProgramaCabecera;
  guia:guiaElectronica;
  fechadespachofiltro:any    = null;
  listafechadespacho:any  = [];


  @ViewChild('agGridDatos', {static:false}) agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  private gridColumnApi:any;

  rowData:any     = [];
  lista:any       = [];
  noRowsTemplate:any;
  frameworkComponents: any;

  columnDefs: ColDef[] = [   
     /*
    {field: 'genera', cellRenderer: ButtonGenerateComponent, resizable: true,
      cellRendererParams:{
        clicked: (field:any) =>{         
          this.generardocumento(field)
          //this.mostarPDF(field);
        }
      } , width: 90  , pinned: 'left'
    }, */
   
    { headerName: 'Gen.', field: 'genera' ,  width: 70  , resizable: true   , pinned: 'left' ,
       editable: false ,
       cellRenderer: 'buttonGenerateNativeRenderer' ,
       cellRendererParams: {
       onClick: this.generardocumento.bind(this),
     } , cellEditor: 'buttonGenerateNativeRenderer'  },  
    


    {field: 'Actu.', cellRenderer: ButtonPrintComponent, resizable: true,
      cellRendererParams:{
        clicked: (field:any) =>{         
          // this.imprimirdocumentoxml(field)           
          this.generarPdf(field);               
        }
      } , width: 70 , pinned: 'left'
    }, 

    {field: 'impr.', cellRenderer: ButtonPrintComponent, resizable: true,
    cellRendererParams:{
      clicked: (field:any) =>{         
        // this.imprimirdocumentoxml(field)
        this.mostarPDF(field);         
        //this.descargar(1, field)
      }
    } , width: 70 , pinned: 'left'
  }, 

    {field: 'xml', cellRenderer: ButtonFileComponent, resizable: true,
      cellRendererParams:{
        clicked: (field:any) =>{         
          // this.imprimirdocumentoxml(field)
          this.descargar(2, field)
        }
      } , width: 70  , pinned: 'left'
    }, 
    
    {field: 'anula', cellRenderer: ButtonDeleteComponent, resizable: true,
      cellRendererParams:{
        clicked: (field:any) =>{         
          this.anulardocumento(field)
        }
      } , width: 80  , pinned: 'left'
    }, 

    {headerName: 'Eliminar', field: 'Eliminar', cellRenderer: ButtonDeleteComponent, 
      cellRendererParams:{
        clicked: (field:any) =>{         
          this.deleteDetalle(field)
        }
      }, width: 80, minWidth: 80
    },
    
    //idlogisticadespacho la columna id
    { headerName: 'ID', field: 'id' ,   width: 100  , resizable: true , minWidth: 100  , floatingFilter: true  , cellStyle: {fontSize: '11px'}    }, //, hide: true , pinned: 'left' 

    { headerName: 'idplanificaciondetalle', field: 'idplanificaciondetalle' ,   width: 80  ,  cellStyle: {fontSize: '11px'} , hide: true },
    { headerName: 'Cliente', field: 'cliente' ,  width: 200  , resizable: true ,  floatingFilter: true ,minWidth: 200 , cellStyle: {fontSize: '11px' , 'text-overflow':'ellipsis','white-space':'nowrap', 'overflow': 'hidden', 'padding': 0 }  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer',
      cellRendererParams: {
        onClick: this.asignaClienteDetalle.bind(this), 
      }, 
      cellEditor: 'textbuttonRenderer' 
    },
    { headerName: 'No.guia', field: 'numeroguia' ,  width: 120  , resizable: true ,  floatingFilter: true ,minWidth: 140 , cellStyle: {fontSize: '11px'}  , //pinned: 'left' ,
      editable: true,
    },

    { headerName: 'Movil', field: 'movil' ,  width: 100  , resizable: true ,  floatingFilter: true ,minWidth: 100 , cellStyle: {fontSize: '11px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
      onClick: this.asignaTransporteDetalle.bind(this),
    }, cellEditor: 'textbuttonRenderer'},

    { headerName: 'Conductor', field: 'conductor' ,  width: 270  , resizable: true ,  floatingFilter: true , minWidth: 280 ,  cellStyle: {fontSize: '11px'}  , //pinned: 'left' ,
      editable: true ,
      cellRenderer: 'textbuttonRenderer' ,
      cellRendererParams: {
      onClick: this.asignaConductorDetalle.bind(this),
    }, cellEditor: 'textbuttonRenderer'},
    
    { headerName: 'Cant sacos', field: 'cantidadsacos' ,  width: 100  , resizable: true ,  floatingFilter: true ,minWidth: 100 , cellStyle: {fontSize: '11px'}  , //pinned: 'left' ,
      editable: true,
    },     
    { headerName: 'Observaciones', field: 'observaciones' ,  width: 270  , resizable: true ,  floatingFilter: true , minWidth: 280 ,  cellStyle: {fontSize: '11px'}  , //pinned: 'left' ,
      editable: true,
    }
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


  constructor( public loadingController: LoadingController, public modalController: ModalController ,
    public toastController: ToastController, public alertController: AlertController  ,
    private servicePlanificacionAguaje: PlanificacionaguajeService , 
    private serviceLogisticadespachoHielo: LogisticadespachohieloService , 
    private servicePlanificacionPrograma: PlanificacionprogramaService) { 
    this.objeto         = new planificacionProgramaCabecera();
    this.guia           = new guiaElectronica();

    this.frameworkComponents = {      
      textbuttonRenderer:   TextbuttonComponent,
      //buttonGenerateComponent: ButtonGenerateComponent
      buttonGenerateNativeRenderer: ButtonGenerateNativeComponent
   }

  }

  ngOnInit() {
    this.getDatos();
  }

  async getDatos(){ 
    try {
      await this.presentLoading();
       
      await this.servicePlanificacionAguaje.getAll().then((respuesta:any) => {
        console.log('lista aguaje' , respuesta)
        this.listAguaje=respuesta
      }) 

    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    } finally {
      this.closeLoading() 
    }
  }

  async onAguajeSelected(){
    //limpiar objeto detalle 
    //this.objetodetalle  = new planificacionProgramaDetalle();
    //consultar datos cabecera y detalle 

    /*
    await this.servicePlanificacionPrograma.getProgramaDetalleLogisticabyIdAguaje(this.objeto.idaguaje).then((respuesta:any) => {
      console.log('list datos' , respuesta)
      if(respuesta.length > 0){
        this.objeto = respuesta[0];
        this.listDetallePrograma = respuesta[0].detalle;
      }else{
        console.log('sin datos'  )
      }     
    }) */

    
    /* //no lo cargo para evitar q demoren en mostrarse los datos
    await this.serviceLogisticadespacho.getImpresionDocumentosbyIdAguaje(this.objeto.idaguaje).then((respuesta:any) => {
      console.log('list datos' , respuesta)
      //this.listDetallePrograma = respuesta;   
      this.rowData = respuesta;  
    })*/ 

    //cargo los datos de las fechas de despacho
    this.fechadespachofiltro    =  null;
    await this.servicePlanificacionPrograma.getProgramaFechaDespachobyIdAguaje(this.objeto.idaguaje).then( async (respuesta:any) => {
      console.log('list fecha despacho (<any>respuesta)' , (<any>respuesta))
      this.listafechadespacho = (<any>respuesta);
    }) 


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
          //this.idprogramaciondetalle  = (<any>data).id
          this.fechadespachofiltro    =   (<any>data).fechadespacho.slice(0,10);
          //this.fechadespachofiltro    =(<any>data).fechadespacho;

          await this.serviceLogisticadespachoHielo.getImpresionDocumentosbyIdAguajeAndFechaDespacho(this.objeto.idaguaje , (<any>data).fechadespacho.slice(0,10)).then((respuesta:any) => {
            console.log('list datos' , respuesta)
            //this.listDetallePrograma = respuesta;   
            this.rowData = respuesta;  
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


  async onUpdateData(){
    try {
        await this.presentLoading();
        if(this.fechadespachofiltro!=null){
          await this.serviceLogisticadespachoHielo.getImpresionDocumentosbyIdAguajeAndFechaDespacho(this.objeto.idaguaje , this.fechadespachofiltro).then((respuesta:any) => {
            console.log('list datos' , respuesta)
            //this.listDetallePrograma = respuesta;   
            this.rowData = respuesta;  
            this.closeLoading();
          }) 
        }

      } catch (error:any) {
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      }finally{
        this.closeLoading();
      }
  }

  async agregarNuevoDetalle(){
    try {
      await this.presentLoading();
      let idusuario = this.serviceLogisticadespachoHielo.userService.usuario.id;  
      let objeto = {idaguaje:0, fechadespacho:0, idusuario: 0};
      objeto.idaguaje = this.objeto.idaguaje;  
      objeto.fechadespacho = this.fechadespachofiltro;
      objeto.idusuario = idusuario;
      // console.log(objeto);
      this.serviceLogisticadespachoHielo.postCreateLogisticaDespachoHieloEmpty(objeto).then(async (resp:any) => {
        console.log('respuesta',resp) ;      
      })
      this.onUpdateData();
    } catch (error:any) {
      this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
    }finally{
      this.closeLoading();
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

  onCellValueChanged(event:any){
    console.log('event.column.colId ->', event.column.colId); 
    let objeto = {id: 0 , campo: '', valor: ''};
    objeto.id = event.data.id;
    objeto.campo = event.column.colId;
    objeto.valor = event.newValue;
    console.log('objeto' , objeto);
    console.log('event.newValue', event.newValue);
   
    const allowedValues = new Set(["numeroguia", "cantidadsacos", "observaciones"]);
    if (allowedValues.has(event.column.colId)) {
      this.serviceLogisticadespachoHielo.postUpdateDetalle(objeto).then(async data => {
        console.log('Campo actualizado ->' , data);
      });
    }
  }
  
  async imprimirdocumentoxml(item:any){
    console.log('item  seleccionado ->',item)
  }

  async imprimirdocumento(item:any){
    console.log('item  seleccionado ->',item)
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

  eliminarRegistro(){
    this.presentAlertConfirm('Atencion', 'Seguro que desea eliminar el registro?').then(resp => {
      if(resp){
        try {
          let idusuario = this.serviceLogisticadespachoHielo.userService.usuario.id;  
          let objeto = {idaguaje:0, fechadespacho:0, idusuario: 0};
          objeto.idaguaje = this.objeto.idaguaje;  
          objeto.fechadespacho = this.fechadespachofiltro;
          objeto.idusuario = idusuario;
          // console.log(objeto);
          this.serviceLogisticadespachoHielo.deleteLogisticaDespachoHieloCabecera(objeto).then(async (resp:any) => {
            console.log('respuesta',resp) ;      
          })
          this.onUpdateData();
        } catch (error:any) {
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        }finally{
          this.closeLoading();
        }
      }
    });
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

  async descargar(tipo:any, data:any)
  {
    console.log('data  seleccionado descarga ->',data)
 

    let numeroautorizacion = data.autorizacion;
    console.log('numeroautorizacion ->',numeroautorizacion)
    try {
      await this.presentLoading();
      await this.serviceLogisticadespachoHielo.getFile(data.autorizacion, tipo , data.idsociedad ).then((data:any) => {
        this.saveAsFile(data, tipo == 1 ? "application/pdf" : "application/xml",  "Guia_"+numeroautorizacion); //numeroguia
      })
    } catch (error:any) {
      this.showMessage(`Ops, ha ocurrido un eror al intentar descargar el ${ tipo == 1 ? 'PDF' : 'XML'} de la guia: ${data.autorizacion}\n`+error.message, "middle", "danger")
    } finally { this.closeLoading() }
  }

  saveAsFile(buffer: any, type: string, name:string): void {
    const data: Blob = new Blob([buffer], {type: type});

    FileSaver.saveAs(data, name + '.'+type.split('/')[1]);
  }


  async generardocumentoV1(item:any){
    console.log('item  seleccionado ->',item)
    let secuencia = 215;
    //console.log('secuencia->', this.generarSecuencia(secuencia , 9))

    if(item.conductor == null ){
      this.showMessage('No se ha asignado un conductor...', "middle", "danger")
      return;
    }

    if(item.transporte == null ){
      this.showMessage('No se ha asignado un transporte...', "middle", "danger")
      return;
    }

    if(item.idlogisticadespachoguia != null){
      this.showMessage('El documento ya fue Generado...', "middle", "danger")
      return;
    }

    // if(item.identificacionproveedor == null ){
    //   this.showMessage('No se ha asignado un RUC al proveedor' +' '+ item.proveedor, "middle", "danger")
    //   return;
    // }
    
    this.guia.razonSocial = 'FA-LOGIC FAJARDO LOGISTICAS S.A.';
    this.guia.ambiente    = '1';
    this.guia.claveFirma  = '123456789';
    this.guia.contribuyenteEspecial = '';
    //this.guia.detalle = 
    this.guia.dirDestinatario = item.cliente;
    this.guia.direccionCarpeta = "C:/home/metric_erp/0993369938001/factue/enviadas";
    this.guia.direccionEstablecimiento = "DURAN - URB BRISAS DE SANTAY";
    this.guia.direccionMatriz = "DURAN - URB BRISAS DE SANTAY";
    this.guia.direccionPartida = "URB BRISAS DE SANTAY";
    this.guia.emision = "1";
    let fechaguia = new Date(item.fechamaterialescampo); 
    this.guia.fechaEmision = this.getFechaFormato(fechaguia, 3);
    console.log('fechaguia ->',fechaguia);
    console.log('fechaguia formato ->', this.getFechaFormato(fechaguia, 3));
    //guiaDetalle
    let detalle = [];  //[{codigoInterno:'', codigoAdicional:'', descripcion: '', cantidad: ''}];
    detalle.push({codigoInterno:item.codigobines, codigoAdicional:item.codigobines, descripcion: 'BINES', cantidad: item.bines});
    detalle.push({codigoInterno:item.codigohielo, codigoAdicional:item.codigohielo, descripcion: 'SACOS DE HIELO', cantidad: item.hielo});
    this.guia.detalle = detalle;
    this.guia.fechaEmisionDocSustento = this.getFechaFormato(fechaguia, 3);
    this.guia.horallegada = this.getFechaFormato(fechaguia, 22);   
    this.guia.librascarro = item.cantidadprogramadamovil;
    this.guia.librasprogramadas = item.cantidadprogramada;
    this.guia.muelle = item.campamento;
    this.guia.nombreComercial = 'FA-LOGIC FAJARDO LOGISTICAS S.A.';
    this.guia.piscina = item.piscina;
    this.guia.placas = item.transporte;
    this.guia.razonSocialTransportista = item.conductor;
    this.guia.identificacionDestinatario = item.identificacionproveedor;  // "0992664630001"; //este es de CYBERNUS SA
    // this.guia.razonSocialDestinatario = item.proveedor;
    this.guia.rucTransportista = item.identificacionconductor;
    this.guia.tipoIdentificacionTransportista = "05";
    //this.guia.numDocSustento = "001-001-000000001";
    //this.guia.numAutDocSustento = "001001000000001"; //"2908202306099336993800110010040000000070000308515"; // "001001000000000001";
    this.guia.ubicacionFirma = "C:/home/metric_erp/firma/0993369938001.p12";
    this.guia.idlogisticadespacho = item.idlogisticadespacho;
    this.guia.idusuario = this.serviceLogisticadespachoHielo.userService.usuario.id;  
    this.guia.ruc = "0993369938001";
    this.guia.obligadoContabilidad = "SI";
    
    //obtener secuencia 
    //enviar el objeto guia con sus paremetros asignados y recuperar los faltantes
    await this.serviceLogisticadespachoHielo.postGeneraLogisticaDespachoHieloGuia(this.guia).then(async (resp:any) => {
      console.log('respuesta',resp) ;      
      this.guia = resp;
      this.guia.secuencialComprobante = this.generarSecuencia(this.guia.secuenciagenerada , 9);
      console.log('this.guia.secuencialComprobante->', this.guia.secuencialComprobante)
      //generar la guia con el webservice del sri...
      await this.serviceLogisticadespachoHielo.postGeneraLogisticaDespachoHieloGuiaDocumento(this.guia).then(async (respuesta:any) => {
          console.log('objeto respuesta ',respuesta);
          console.log('respuesta.codigo ',respuesta.codigo);
          this.guia.autorizacion = respuesta.autorizacion;
          //this.guia.autorizacion = respuesta
          if(respuesta.codigo == "01"){
            this.showMessage(respuesta.mensaje1, "middle", "success");   
            console.log('actualizar la secuencia ');
            await this.serviceLogisticadespachoHielo.postUpdateAutorizacionLogisticaDespachoHieloGuia(this.guia).then(async (data:any) => {
              console.log('datos de guia actualizados.... ');
              item.idlogisticadespachoguia = this.guia.id;
              console.log('item.idlogisticadespachoguia ->' , item.idlogisticadespachoguia);
              this.onAguajeSelected();

            }).catch((error:any) => {
              console.log('error al actualizar guia'+error)
              this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
            })
          }

      }).catch((error:any) => {
        console.log('error al generar guia servicio sri'+error)
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })

   
   }).catch((error:any) => {
     console.log(error)
     this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
   })
   
   console.log(' secuencialComprobante fuera de post->', this.guia.secuencialComprobante)

    //enviar el objeto guia completo al servicio que conecta con el SRI 


  }


  async generardocumentoV2(item:any){
    console.log('item  seleccionado ->',item)

    if(item.conductor == null ){
      this.showMessage('No se ha asignado un conductor...', "middle", "danger")
      return;
    }

    if(item.transporte == null ){
      this.showMessage('No se ha asignado un transporte...', "middle", "danger")
      return;
    }
   
    if(item.identificacionconductor == null ){
      this.showMessage('No se ha asignado una Identificacion al conductor del transporte...', "middle", "danger")
      return;
    }

    if(item.idlogisticadespachoguia != null){
      this.showMessage('El documento ya fue Generado...', "middle", "danger")
      return;
    }

    // if(item.identificacionproveedor == null || item.identificacionproveedor.length <= 0  ){
    //   this.showMessage('No se ha asignado un RUC al proveedor' +' '+ item.proveedor, "middle", "danger")
    //   return;
    // }

    if(item.idsociedad == null){
      this.showMessage('Nose ha asignado una Sociedad en la programacion ...', "middle", "danger")
      return;
    }

    console.log('paso...')

    try {

      await this.presentLoading('Consultando Sociedad...');
      let sociedad:any = null;
      await this.servicePlanificacionPrograma.getSociedadById(item.idsociedad).then(async (respuesta:any) => {
        console.log('Sociedad by id' , respuesta)
        sociedad = <any>respuesta[0];
        this.closeLoading();
      }).catch((error:any) => {
        console.log(error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })

      console.log('Sociedad objeto' , sociedad)

      this.guia            = new guiaElectronica();
      this.guia.idsociedad = item.idsociedad;
      this.guia.razonSocial = sociedad.nombre;
      this.guia.ambiente    = sociedad.ambiente;
      this.guia.claveFirma  = sociedad.clavefirma;
      this.guia.contribuyenteEspecial = sociedad.contribuyenteespecial;
      this.guia.dirDestinatario = item.cliente;
      this.guia.direccionCarpeta = sociedad.direccionenviadas;  
      this.guia.direccionEstablecimiento = sociedad.direccionestablecimiento;
      this.guia.direccionMatriz = sociedad.direccionmatriz;
      this.guia.direccionPartida = sociedad.direccionpartida;
      this.guia.emision = sociedad.emision;
      let fechaguia = new Date(item.fechamaterialescampo); 
      this.guia.fechaEmision = this.getFechaFormato(fechaguia, 3);
      console.log('fechaguia ->',fechaguia);
      console.log('fechaguia formato ->', this.getFechaFormato(fechaguia, 3));
      //guiaDetalle
      let detalle = [];  //[{codigoInterno:'', codigoAdicional:'', descripcion: '', cantidad: ''}];
      detalle.push({codigoInterno:item.codigobines, codigoAdicional:item.codigobines, descripcion: item.labelbines, cantidad: item.bines});
      detalle.push({codigoInterno:item.codigohielo, codigoAdicional:item.codigohielo, descripcion: item.labelhielo, cantidad: item.hielo});
      if(item.meta!=null){
        if(item.meta > 0 ){
          detalle.push({codigoInterno:item.codigometa, codigoAdicional:item.codigometa, descripcion: item.labelmeta, cantidad: item.meta});
        }
      }
      if(item.sal!=null){
        if(item.sal > 0 ){
          detalle.push({codigoInterno:item.codigosal, codigoAdicional:item.codigosal, descripcion: item.labelsal, cantidad: item.sal});
        }
      }
      if(item.conica!=null){
        if(item.conica > 0 ){
          detalle.push({codigoInterno:item.codigoconica, codigoAdicional:item.codigoconica, descripcion: item.labelconica, cantidad: item.conica});
        }
      }
      if(item.calada!=null){
        if(item.calada > 0 ){
          detalle.push({codigoInterno:item.codigocalada, codigoAdicional:item.codigocalada, descripcion: item.labelcalada, cantidad: item.calada});
        }
      }
      
      this.guia.detalle = detalle;
      
      this.guia.fechaEmisionDocSustento = this.getFechaFormato(fechaguia, 3);
      let horallegada = new Date(item.horaarribocamaronera != null ? item.horaarribocamaronera : item.fechamaterialescampo );
      //fechaarriboplanta
      let fechaFinTransporte = new Date(item.fechaarriboplanta)
      this.guia.fechafintransporte = this.getFechaFormato(fechaFinTransporte, 3);
      this.guia.horallegada = this.getFechaFormato(horallegada, 22); //aki revisar fecha de transporte
      this.guia.librascarro = this.currencyFormatterLabel(item.cantidadprogramadamovil);
      this.guia.librasprogramadas = this.currencyFormatterLabel(item.cantidadprogramada);
      this.guia.muelle = item.campamento;
      this.guia.nombreComercial = sociedad.nombrecomercial;
      this.guia.piscina = item.piscina;
      this.guia.placas = item.transporte;
      this.guia.razonSocialTransportista = item.conductor;
      this.guia.identificacionDestinatario = item.identificacionproveedor;  // "0992664630001"; //este es de CYBERNUS SA
      // this.guia.razonSocialDestinatario = item.proveedor;
      this.guia.rucTransportista = item.identificacionconductor.trim();
      this.guia.tipoIdentificacionTransportista = "05";
      this.guia.ubicacionFirma = sociedad.ubicacionfirma;
      this.guia.idlogisticadespacho = item.idlogisticadespacho;
      this.guia.idusuario = this.serviceLogisticadespachoHielo.userService.usuario.id;  
      this.guia.ruc = sociedad.ruc;
      this.guia.obligadoContabilidad = sociedad.obligadocontabilidad;
      this.guia.rutalogo = sociedad.logo;
      this.guia.sellos = item.sellos;

      //obtener secuencia 
      await this.presentLoading('Generando guia y secuencial, espere...');
      //enviar el objeto guia con sus paremetros asignados y recuperar los faltantes
      await this.serviceLogisticadespachoHielo.postGeneraLogisticaDespachoHieloGuia(this.guia).then(async (resp:any) => {
          console.log('respuesta',resp) ;      
          this.guia = resp;
          this.guia.secuencialComprobante = this.generarSecuencia(this.guia.secuenciagenerada , 9);
          console.log('this.guia.secuencialComprobante->', this.guia.secuencialComprobante)
          this.closeLoading();
      }).catch((error:any) => {
          console.log(error)
          this.closeLoading();
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })

      //generar la guia con el webservice del sri...
      await this.presentLoading('Enviando guia al SRI, espere...');
      let respuestacodigo = "";
      let respuestamensaje = "";
      await this.serviceLogisticadespachoHielo.postGeneraLogisticaDespachoHieloGuiaDocumento(this.guia).then(async (respuesta:any) => {
          console.log('objeto respuesta ',respuesta);
          console.log('respuesta.codigo ',respuesta.codigo);
          this.guia.autorizacion = respuesta.autorizacion;
          respuestacodigo = respuesta.codigo;
          respuestamensaje = respuesta.mensaje1;
          this.closeLoading();

      }).catch((error:any) => {
        console.log('error al generar guia servicio sri'+error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })

      //this.guia.autorizacion = respuesta
      if(respuestacodigo == "01"){
        this.showMessage(respuestamensaje, "middle", "success");   
        console.log('actualizar la secuencia ');
        await this.presentLoading('Actualizando datos, espere...');
        await this.serviceLogisticadespachoHielo.postUpdateAutorizacionLogisticaDespachoHieloGuia(this.guia).then(async (data:any) => {
          console.log('datos de guia actualizados.... ');
          item.idlogisticadespachoguia = this.guia.id;
          console.log('item.idlogisticadespachoguia ->' , item.idlogisticadespachoguia);
          this.closeLoading();
          //this.onAguajeSelected();     

          
        }).catch((error:any) => {
          console.log('error al actualizar guia'+error)
          this.closeLoading();
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        })

         //actualizar los datos en la vista
          //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
        /*  var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id);  
          let numeroguia = this.guia.codigoEstablecimiento + this.guia.codigoPuntoEmision + this.guia.secuencialComprobante;          
          rowNode.setDataValue('numeroguia', numeroguia);
          rowNode.setDataValue('autorizacion', this.guia.autorizacion); */
      }


    } catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally { 
      this.gridApi.refreshCells();
      this.closeLoading() 
    }  

  }


  async generardocumento(data:any){
    console.log('data.rowData  seleccionado ->',data.rowData)

    let item = data.rowData;

    if(item.conductor == null ){
      this.showMessage('No se ha asignado un conductor...', "middle", "danger")
      return;
    }

    if(item.transporte == null ){
      this.showMessage('No se ha asignado un transporte...', "middle", "danger")
      return;
    }
   
    if(item.identificacionconductor == null ){
      this.showMessage('No se ha asignado una Identificacion al conductor del transporte...', "middle", "danger")
      return;
    }

    if(item.idlogisticadespachoguia != null){
      this.showMessage('El documento ya fue Generado...', "middle", "danger")
      return;
    }

    // if(item.identificacionproveedor == null || item.identificacionproveedor.length <= 0  ){
    //   this.showMessage('No se ha asignado un RUC al proveedor' +' '+ item.proveedor, "middle", "danger")
    //   return;
    // }

    if(item.idsociedad == null){
      this.showMessage('No se ha asignado una Sociedad en la programacion ...', "middle", "danger")
      return;
    }

    if(item.piscina == null || item.piscina.length <= 0){
      this.showMessage('No se ha asignado una Piscina en la Programacion ...', "middle", "danger")
      return;
    }

    if(item.campamento == null || item.campamento.length <= 0){
      this.showMessage('No se ha asignado un Campamento en la Programacion ...', "middle", "danger")
      return;
    }

    // if(item.sector == null || item.sector.length <= 0){
    //   this.showMessage('No se ha asignado un Sector Proveedor(Origen) en la Programacion ...', "middle", "danger")
    //   return;
    // }
     
    if(item.sectorcliente == null || item.sectorcliente.length <= 0){
      this.showMessage('No se ha asignado un Sector Cliente(Destino) en la Programacion ...', "middle", "danger")
      return;
    }

    if(item.base == null || item.base.length <= 0){
      this.showMessage('No se ha asignado una Base de Operacion(Partida) en la Gestion de Despachos ...', "middle", "danger")
      return;
    }

    console.log('paso...')

    try {

      await this.presentLoading('Consultando Sociedad...');
      let sociedad:any = null;
      await this.servicePlanificacionPrograma.getSociedadById(item.idsociedad).then(async (respuesta:any) => {
        console.log('Sociedad by id' , respuesta)
        sociedad = <any>respuesta[0];
        this.closeLoading();
      }).catch((error:any) => {
        console.log(error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })

      console.log('Sociedad objeto' , sociedad)

      this.guia            = new guiaElectronica();
      this.guia.idsociedad = item.idsociedad;
      this.guia.razonSocial = sociedad.nombre;
      this.guia.ambiente    = sociedad.ambiente;
      this.guia.claveFirma  = sociedad.clavefirma;
      this.guia.contribuyenteEspecial = sociedad.contribuyenteespecial;
      //this.guia.dirDestinatario = item.cliente;
      this.guia.direccionCarpeta = sociedad.direccionenviadas;  
      this.guia.direccionEstablecimiento = sociedad.direccionestablecimiento;
      this.guia.direccionMatriz = sociedad.direccionmatriz;
      this.guia.direccionPartida = item.sector; //sociedad.direccionpartida;
      this.guia.emision = sociedad.emision;
      let fechaguia = new Date(item.fechamaterialescampo); 
      this.guia.fechaEmision = this.getFechaFormato(fechaguia, 3);
      console.log('fechaguia ->',fechaguia);
      console.log('fechaguia formato ->', this.getFechaFormato(fechaguia, 3));
      //guiaDetalle
      let detalle = [];  //[{codigoInterno:'', codigoAdicional:'', descripcion: '', cantidad: ''}];
      detalle.push({codigoInterno:item.codigobines, codigoAdicional:item.codigobines, descripcion: item.labelbines, cantidad: item.bines});
      detalle.push({codigoInterno:item.codigohielo, codigoAdicional:item.codigohielo, descripcion: item.labelhielo, cantidad: item.hielo});
      if(item.meta!=null){
        if(item.meta > 0 ){
          detalle.push({codigoInterno:item.codigometa, codigoAdicional:item.codigometa, descripcion: item.labelmeta, cantidad: item.meta});
        }
      }
      if(item.sal!=null){
        if(item.sal > 0 ){
          detalle.push({codigoInterno:item.codigosal, codigoAdicional:item.codigosal, descripcion: item.labelsal, cantidad: item.sal});
        }
      }
      if(item.conica!=null){
        if(item.conica > 0 ){
          detalle.push({codigoInterno:item.codigoconica, codigoAdicional:item.codigoconica, descripcion: item.labelconica, cantidad: item.conica});
        }
      }
      if(item.calada!=null){
        if(item.calada > 0 ){
          detalle.push({codigoInterno:item.codigocalada, codigoAdicional:item.codigocalada, descripcion: item.labelcalada, cantidad: item.calada});
        }
      }
      
      this.guia.detalle = detalle;
      
      this.guia.fechaEmisionDocSustento = this.getFechaFormato(fechaguia, 3);
      let horallegada = new Date(item.horaarribocamaronera != null ? item.horaarribocamaronera : item.fechamaterialescampo );
      //fechaarriboplanta
      let fechaFinTransporte = new Date(item.fechaarriboplanta)
      this.guia.fechafintransporte = this.getFechaFormato(fechaFinTransporte, 3);
      this.guia.horallegada = this.getFechaFormato(horallegada, 22); //aki revisar fecha de transporte
      this.guia.librascarro = this.currencyFormatterLabel(item.cantidadprogramadamovil);
      this.guia.librasprogramadas = this.currencyFormatterLabel(item.cantidadprogramada);
      this.guia.muelle = item.muelle == null ? "SN": item.muelle; //campamento
      this.guia.nombreComercial = sociedad.nombrecomercial;
      this.guia.piscina = item.piscina;
      this.guia.placas = item.transporte;
      this.guia.razonSocialTransportista = item.conductor;
      this.guia.identificacionDestinatario = item.identificacionproveedor;  // "0992664630001"; //este es de CYBERNUS SA
      // this.guia.razonSocialDestinatario = item.proveedor;
      this.guia.dirDestinatario = item.sectorcliente == null ? "-": item.sectorcliente == "" ? "-":item.sectorcliente;
      this.guia.rucTransportista = item.identificacionconductor.trim();
      this.guia.tipoIdentificacionTransportista = "05";
      this.guia.ubicacionFirma = sociedad.ubicacionfirma;
      this.guia.idlogisticadespacho = item.idlogisticadespacho;
      this.guia.idusuario = this.serviceLogisticadespachoHielo.userService.usuario.id;  
      this.guia.ruc = sociedad.ruc;
      this.guia.obligadoContabilidad = sociedad.obligadocontabilidad;
      this.guia.rutalogo = sociedad.logo;
      this.guia.sellos = item.sellos;
       
      let cliente = item.cliente.replace("-", " ");
      this.guia.cliente = cliente;

      this.guia.base      = item.base;
      //this.guia.piloto    = item.piloto;
      //this.guia.copiloto  = item.copiloto;
      this.guia.binescarro     = item.binescarro;
      //this.guia.fechaautorizacion = item.fechaautorizacion;

      //obtener secuencia 
      await this.presentLoading('Generando guia y secuencial, espere...');
      //enviar el objeto guia con sus paremetros asignados y recuperar los faltantes
      await this.serviceLogisticadespachoHielo.postGeneraLogisticaDespachoHieloGuia(this.guia).then(async (resp:any) => {
          console.log('respuesta',resp) ;      
          this.guia = resp;
          this.guia.secuencialComprobante = this.generarSecuencia(this.guia.secuenciagenerada , 9);
          console.log('this.guia.secuencialComprobante->', this.guia.secuencialComprobante)
          this.closeLoading();
      }).catch((error:any) => {
          console.log(error)
          this.closeLoading();
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })

      //generar la guia con el webservice del sri...
      await this.presentLoading('Enviando guia al SRI, espere...');
      let respuestacodigo = "";
      let respuestamensaje = "";
      await this.serviceLogisticadespachoHielo.postGeneraLogisticaDespachoHieloGuiaDocumento(this.guia).then(async (respuesta:any) => {
          console.log('objeto respuesta ',respuesta);
          console.log('respuesta.codigo ',respuesta.codigo);
          this.guia.autorizacion = respuesta.autorizacion;
          this.guia.fechaautorizacion = respuesta.fechaautorizacion;
          respuestacodigo = respuesta.codigo;
          respuestamensaje = respuesta.mensaje1;
          this.closeLoading();

      }).catch((error:any) => {
        console.log('error al generar guia servicio sri'+error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })

      //this.guia.autorizacion = respuesta
      if(respuestacodigo == "01"){
        this.showMessage(respuestamensaje, "middle", "success");   
        console.log('actualizar la secuencia ');
        await this.presentLoading('Actualizando datos, espere...');
        await this.serviceLogisticadespachoHielo.postUpdateAutorizacionLogisticaDespachoHieloGuia(this.guia).then(async (data:any) => {
          console.log('datos de guia actualizados.... ');
          item.idlogisticadespachoguia = this.guia.id;
          console.log('item.idlogisticadespachoguia ->' , item.idlogisticadespachoguia);
          this.closeLoading();
          //this.onAguajeSelected();     

          
        }).catch((error:any) => {
          console.log('error al actualizar guia'+error)
          this.closeLoading();
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        })

        console.log('(<any>data).rowData ->' , (<any>data).rowData);
        console.log('(<any>data).rowData.idlogisticadespacho ->' , (<any>data).rowData.idlogisticadespacho);
          //actualizar los datos en la vista
          //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
          var rowNode:any = this.gridApi.getRowNode((<any>data).rowData.id);  
          let numeroguia = this.guia.codigoEstablecimiento + this.guia.codigoPuntoEmision + this.guia.secuencialComprobante;          
          rowNode.setDataValue('numeroguia', numeroguia);
          rowNode.setDataValue('autorizacion', this.guia.autorizacion); 

      }


    } catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally { 
      this.gridApi.refreshCells();
      this.closeLoading() 
    }  

  }

  //genera un pdf con los datos ya existentes
  async generarPdf(data:any){
    //console.log('data.rowData  seleccionado ->',data.rowData)
    console.log('data  seleccionado ->',data)
    
    let item = data;

    if(item.idlogisticadespachoguia == null || item.idlogisticadespachoguia.length <= 0){
      this.showMessage('Primero debe generar la Guia...', "middle", "danger")
      return;
    }

    try {

      await this.presentLoading('Recopilando informacion...');
      //await this.presentLoading('Consultando Sociedad...');
      let sociedad:any = null;
      await this.servicePlanificacionPrograma.getSociedadById(item.idsociedad).then(async (respuesta:any) => {
        console.log('Sociedad by id' , respuesta)
        sociedad = <any>respuesta[0];
        this.closeLoading();
      }).catch((error:any) => {
        console.log(error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
      })


      this.guia            = new guiaElectronica();
      this.guia.idsociedad = item.idsociedad;
      this.guia.razonSocial = sociedad.nombre;
      this.guia.ambiente    = sociedad.ambiente;
      this.guia.claveFirma  = sociedad.clavefirma;
      this.guia.contribuyenteEspecial = sociedad.contribuyenteespecial;
      //this.guia.dirDestinatario = item.cliente;
      this.guia.direccionCarpeta = sociedad.direccionenviadas;  
      this.guia.direccionEstablecimiento = sociedad.direccionestablecimiento;
      this.guia.direccionMatriz = sociedad.direccionmatriz;
      this.guia.direccionPartida = item.sector; //sociedad.direccionpartida;
      this.guia.emision = sociedad.emision;
      let fechaguia = new Date(item.fechamaterialescampo); 
      this.guia.fechaEmision = this.getFechaFormato(fechaguia, 3);
      console.log('fechaguia ->',fechaguia);
      console.log('fechaguia formato ->', this.getFechaFormato(fechaguia, 3));
      //guiaDetalle
      let detalle = [];  //[{codigoInterno:'', codigoAdicional:'', descripcion: '', cantidad: ''}];
      detalle.push({codigoInterno:item.codigobines, codigoAdicional:item.codigobines, descripcion: item.labelbines, cantidad: item.bines});
      detalle.push({codigoInterno:item.codigohielo, codigoAdicional:item.codigohielo, descripcion: item.labelhielo, cantidad: item.hielo});
      if(item.meta!=null){
        if(item.meta > 0 ){
          detalle.push({codigoInterno:item.codigometa, codigoAdicional:item.codigometa, descripcion: item.labelmeta, cantidad: item.meta});
        }
      }
      if(item.sal!=null){
        if(item.sal > 0 ){
          detalle.push({codigoInterno:item.codigosal, codigoAdicional:item.codigosal, descripcion: item.labelsal, cantidad: item.sal});
        }
      }
      if(item.conica!=null){
        if(item.conica > 0 ){
          detalle.push({codigoInterno:item.codigoconica, codigoAdicional:item.codigoconica, descripcion: item.labelconica, cantidad: item.conica});
        }
      }
      if(item.calada!=null){
        if(item.calada > 0 ){
          detalle.push({codigoInterno:item.codigocalada, codigoAdicional:item.codigocalada, descripcion: item.labelcalada, cantidad: item.calada});
        }
      }
      
      this.guia.detalle = detalle;
      
      this.guia.fechaEmisionDocSustento = this.getFechaFormato(fechaguia, 3);
      let horallegada = new Date(item.horaarribocamaronera != null ? item.horaarribocamaronera : item.fechamaterialescampo );
      //fechaarriboplanta
      let fechaFinTransporte = new Date(item.fechaarriboplanta)
      this.guia.fechafintransporte = this.getFechaFormato(fechaFinTransporte, 3);
      this.guia.horallegada = this.getFechaFormato(horallegada, 22); //aki revisar fecha de transporte
      this.guia.librascarro = this.currencyFormatterLabel(item.cantidadprogramadamovil);
      this.guia.librasprogramadas = this.currencyFormatterLabel(item.cantidadprogramada);
      this.guia.muelle = item.muelle == null ? "SN": item.muelle; //campamento
      this.guia.nombreComercial = sociedad.nombrecomercial;
      this.guia.piscina = item.piscina;
      this.guia.placas = item.transporte;
      this.guia.razonSocialTransportista = item.conductor;
      this.guia.identificacionDestinatario = item.identificacionproveedor;  // "0992664630001"; //este es de CYBERNUS SA
      // this.guia.razonSocialDestinatario = item.proveedor;
      this.guia.dirDestinatario = item.sectorcliente == null ? "-": item.sectorcliente == "" ? "-":item.sectorcliente;
      this.guia.rucTransportista = item.identificacionconductor.trim();
      this.guia.tipoIdentificacionTransportista = "05";
      this.guia.ubicacionFirma = sociedad.ubicacionfirma;
      this.guia.idlogisticadespacho = item.idlogisticadespacho;
      this.guia.idusuario = this.serviceLogisticadespachoHielo.userService.usuario.id;  
      this.guia.ruc = sociedad.ruc;
      this.guia.obligadoContabilidad = sociedad.obligadocontabilidad;
      this.guia.rutalogo = sociedad.logo;
      this.guia.sellos = item.sellos;
       
      let cliente = item.cliente.replace("-", " ");
      this.guia.cliente = cliente;

      this.guia.base = item.base;
      this.guia.fechaautorizacion = item.fechaautorizacion;
      this.guia.autorizacion = item.autorizacion;
      this.guia.secuencialComprobante = item.numeroguia;
      this.guia.codigoEstablecimiento = item.establecimiento;
      //asigna estab
      this.guia.codigoPuntoEmision    = item.puntoemision;
      this.guia.id                    = item.idlogisticadespachoguia; //TODO
      this.guia.direccionconsultapdf  = item.direccionconsultapdf;
      //this.guia.piloto                = item.piloto;
      //this.guia.copiloto              = item.copiloto;
      this.guia.binescarro                   = item.binescarro;

      //generar el documento pdf de la guia con los datos actualizados...
      await this.presentLoading('Generando Pdf Actualizado, espere...');
      let respuestacodigo = "";
      let respuestamensaje = "";
      await this.serviceLogisticadespachoHielo.postGeneraLogisticaDespachoHieloGuiaDocumentoPdf(this.guia).then(async (respuesta:any) => {
          console.log('objeto respuesta ',respuesta);
          console.log('respuesta.codigo ',respuesta.codigo);
          //this.guia.autorizacion = respuesta.autorizacion;
          //this.guia.fechaautorizacion = respuesta.fechaautorizacion;
          respuestacodigo = respuesta.codigo;
          respuestamensaje = respuesta.mensaje1;
          this.closeLoading();

      }).catch((error:any) => {
        console.log('error al generar pdf actualizado'+error)
        this.closeLoading();
        this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
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


  generarSecuencia(secuencia:any , cantidaddigitos:any ){
    let numberOutput = Math.abs(secuencia);
    let longitud_secuencia = secuencia.toString().length;
    let zero = "0";

    if(cantidaddigitos <= longitud_secuencia ){
      if(secuencia < 0){
        return ("-" + numberOutput.toString());
      }else{
        return numberOutput.toString();
      }
    }else{
      if(secuencia < 0){
        return ("-" + ( zero.repeat(cantidaddigitos - longitud_secuencia)) + numberOutput.toString());
      }else{
        return (( zero.repeat(cantidaddigitos - longitud_secuencia)) + numberOutput.toString());
      }
    }


  }


  async mostarPDF(data:any){//numeroguia
    console.log('data  seleccionado ->',data)

    if(data.idlogisticadespachoguia == null){
      this.showMessage('No existe un documento Generado...', "middle", "danger")
      return;
    }


    let datax = await this.serviceLogisticadespachoHielo.getFile(data.autorizacion, 1 , data.idsociedad ); //data.id
    const modal = await this.modalController.create({
      component: VisualizadorPage,
      componentProps: { titulo: 'Guia: ' +data.autorizacion , dataBlob: datax },
      cssClass: 'modal-pdf'
    }) ; 
    //await this.cerrarLoading();
    await modal.present();
    await modal.onDidDismiss();

    this.descargar(1, data)

  }

  async anulardocumento(item:any){
    console.log('item  seleccionado ->',item)

    if(item.idlogisticadespachoguia == null){
      this.showMessage('No existe un documento Generado para anular...', "middle", "danger")
      return;
    }

    this.presentAlertConfirm('Atencion', 'Esta seguro que desea anular la Guia' +' '+ item.numeroguia +' '+ '?').then(async resp => {
      if(resp){
        
        await this.presentLoading('Anulando Documento Guia , espere...');
        //enviar el objeto guia con sus paremetros asignados  
        await this.serviceLogisticadespachoHielo.postUpdateAnularLogisticaDespachoHieloGuia(item).then(async (resp:any) => {
            console.log('respuesta comprobante anulado',resp) ;      
            this.closeLoading();
        }).catch((error:any) => {
            console.log(error)
            this.closeLoading();
            this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        })

        await this.presentLoading('Moviendo a carpeta de anulados, espere...');
        let respuestacodigo = "";
        let respuestamensaje = "";
        await this.serviceLogisticadespachoHielo.getUpdateAnularLogisticaDespachoHieloGuiaDocumento(item.direccionenviadas , item.direccionanuladas).then(async (respuesta:any) => {
            console.log('objeto respuesta ',respuesta);
            console.log('respuesta.codigo ',respuesta.codigo);
            respuestacodigo = respuesta.codigo;
            respuestamensaje = respuesta.mensaje1;
            this.closeLoading();
            //this.onAguajeSelected();      
            this.onUpdateData();
        }).catch((error:any) => {
          console.log('error al mover guia anulada'+error)
          this.closeLoading();
          this.showMessage(error.error == undefined ? error.message : error.error, "middle", "danger")
        })

        this.onUpdateData();

      }
    })


  }  


  getFechaFormato(fecha:any , formato=0 ){
    if(fecha == null) return ''
    let dia:any = new Date(fecha).getUTCDate()
    if(dia < 10) dia = '0' + dia;

    let mes:any = new Date(fecha).getUTCMonth() + 1
    if(mes < 10) mes = '0' + mes;

    let hora:any = new Date(fecha).getUTCHours()
    if(hora < 10) hora = '0' + hora;

    let minuto:any = new Date(fecha).getUTCMinutes()
    if(minuto < 10) minuto = '0' + minuto;
    
    let segundo:any = new Date(fecha).getUTCSeconds()
    if(segundo < 10) segundo = '0' + segundo;

    if(formato == 2) return hora + ':' + minuto + ':' + segundo
    if(formato == 22) return hora + ':' + minuto
    if(formato == 3) return dia + '/' + mes + '/' +  new Date(fecha).getFullYear()

    return dia + '/' + mes + '/' +  new Date(fecha).getFullYear() + ' ' + hora + ':' + minuto + ':' + segundo
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


  currencyFormatterLabel( params:any ) {  //(<any>respuesta))
    //let dato = params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    let dato = Number(params).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    //console.log(params.value)
    //console.log(dato)
    let resultado = params == null ? null : dato;
    return resultado+''
  }
  
  async asignaClienteDetalle(item:any){
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
            rowNode.setDataValue('cliente', (<any>data).etiqueta);
          
            let objeto = {id: 0, campo: '', valor: 0};
            objeto.id = rowNode.data.id; 
            objeto.campo = 'idcliente';  
            objeto.valor = (<any>data).id;  
            console.log('objeto a enviar' , objeto)
            
            this.serviceLogisticadespachoHielo.postUpdateDetalle(objeto).then(async data => {
              console.log('Campo actualizado ->' , data);
            });
      
            this.gridApi.redrawRows();
          }
        })
      })
    }catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    }finally { 
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
            // objeto.campo = 'placa';  
            objeto.valor = (<any>data).id;
            console.log('objeto' , objeto)

            this.serviceLogisticadespachoHielo.postUpdateDetalle(objeto).then(async data => {
              console.log('Campo actualizado ->' , data);
            });
            this.gridApi.redrawRows();
            
            // this.serviceLogisticadespachoHielo.getTransporte (objeto).then(async data2 => {
            //   //this.objeto = <any>data2
            //   console.log('objeto conductor actualizado->' , data2);
            //   rowNode.setDataValue('movil', (<any>data2).placa);
            //   this.gridApi.redrawRows();
            // })  
          }
        })
      })
    }catch (error) {
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
        await this.serviceLogisticadespachoHielo.getTransporte().then(async (respuesta:any) => {
          console.log('lista transporte' , respuesta) 
          this.closeLoading();
          await this.mostrarFormularioBusqueda('Lista de Transportes', <any>respuesta, ["placa"]).then(data => {
            if(!!data){
              //con el ID recuperado del objeto seleccionado en la grid para acceder a sus columnas
              var rowNode:any = this.gridApi.getRowNode((<any>item).rowData.id); //idlogisticadespacho
              rowNode.setDataValue('movil', (<any>data).descripcion);
              
              let objeto = {id: 0 , campo: '' , valor : ''};
              objeto.id =   rowNode.data.id;  
              objeto.campo = 'idtransporte';  
              objeto.valor = (<any>data).id;
              //console.log('objeto' , objeto)
              //if(event.newValue != ''){
              this.serviceLogisticadespachoHielo.postUpdateDetalle(objeto).then(async data => {
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

  async deleteDetalle(item:any){
    console.log('item ->' , item );
    try {
      await this.presentLoading();

      let objeto = {id :0};
      objeto.id = item.id;
      console.log('objeto', objeto);

      this.serviceLogisticadespachoHielo.deleteLogisticaDespachoHieloDetalle(objeto).then(async data2 => {
        console.log('Detalle eliminado ->' , data2);
      })  
      this.onUpdateData();
    }catch (error) {
      //setTimeout(() => { this.rows2.last.setFocus(); }, 1005);
      console.log('error es ',error)
      this.showMessage(error, "middle", "danger",1000)
    } finally { 
      this.gridApi.refreshCells();
      this.closeLoading() 
    }  
  }

}
