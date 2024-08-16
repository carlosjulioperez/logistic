import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
//import { ICellRendererParams } from 'ag-grid-community';
import {
  ColDef,
  Grid,
  GridOptions,
  ICellEditorComp,
  ICellEditorParams,
  ICellRendererParams
} from 'ag-grid-community';
//import { IonicModule } from '@ionic/angular';
//import * as 'jquery';
declare const $: any;
//import * as $ from 'jquery'; 
//import 'jquery-ui-dist/jquery-ui'; 
//var $j = jQuery.noConflict();
//import * as $j from 'jquery'; 

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  //imports:[IonicModule]
})
export class DatePickerComponent  implements OnInit , ICellEditorComp { // ICellEditorComp    ICellRendererAngularComp
  
  public eInput!: HTMLInputElement;
  private params: any;

  constructor() { }

  ngOnInit() {
    //$( "#datepicker" ).datepicker(); 
  
  }

  //agInit(params: any): void { //ICellRendererParams<any, any, any>
    //this.params = params;
  //}

    // gets called once before the renderer is used
    init(params: any) {
      // create the cell
      this.eInput = document.createElement('input');
      this.eInput.value = params.value;
      this.eInput.classList.add('ag-input');
      this.eInput.style.height = 'var(--ag-row-height)';
      this.eInput.style.fontSize = 'calc(var(--ag-font-size) + 1px)';
      this.eInput.type = 'datetime-local'
      //datepicker(options: JQueryUI.DatepickerOptions): JQuery;
      // https://jqueryui.com/datepicker/
      $(this.eInput).datetimepicker({ 
        dateFormat: 'dd/mm/yy',
        onSelect: () => {
          this.eInput.focus();
        },  
      });

      

    }

    refresh(params: ICellRendererParams): boolean {
      this.params =  this.getValueToDisplay(params)
      return true
    }
  
    getValueToDisplay(params: ICellRendererParams){
  
      return params.valueFormatted ? params.valueFormatted : params.data;
    } 

     // gets called once when grid ready to insert the element
  getGui() {
    return this.eInput;
  }

  // focus and select can be done after the gui is attached
  afterGuiAttached() {
    this.eInput.focus();
    this.eInput.select();
  }

  // returns the new value after editing
  getValue() {
    return this.eInput.value;
  }

  // any cleanup we need to be done here
  destroy() {
    // but this example is simple, no cleanup, we could
    // even leave this method out as it's optional
  }

  // if true, then this editor will appear in a popup
  isPopup() {
    // and we could leave this method out also, false is the default
    return false;
  }

}
