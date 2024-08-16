import { Component, OnInit } from '@angular/core';
//import { Component  } from '@angular/core';
import { ICellRendererAngularComp } from  'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IonicModule } from '@ionic/angular';

//(click)="onClick($event)"   (click)="btnClickedHandler($event)"

@Component({
  selector: 'app-dateinput',
  templateUrl: './dateinput.component.html', 
  /*template: `
    <input 
      type="datetime-local" 
      (click)="btnClickedHandler($event)"
      [value]="params.value"
    />`,*/
  styleUrls: ['./dateinput.component.scss'],
  imports:[IonicModule],
  standalone:true
})
export class DateinputComponent  implements OnInit ,ICellRendererAngularComp {

  params: any;

  constructor() { }

  ngOnInit() {}

  agInit(params: any): void {
    this.params = params;
  }
 
  dateTimeUpdated($event:any){
    console.log('eeeee',$event.target.value)
    //console.log('this.params.value',this.params.value)
    console.log('this.params',this.params)
    //this.params.changed(this.params.data); stopEditing
    this.params.value = $event.target.value;
    console.log('this.params.value',this.params.value)
    console.log('this.params.onKeyDown',this.params.onKeyDown)
    this.params.onKeyDown($event);

  }

  btnClickedHandler(e:any){
    //this.params.clicked(this.params.data);
    //console.log('eeeee',e.target.value)
    this.params.value = e.target.value;
    console.log('this.params.value',this.params.value)
    //let colId = this.params.column.colId;
    //this.params.node.setDataValue(colId, e.target.value);

    this.params.onClick(this.params.data);
  }

  onClick($event:any) {
    let valor = $event.target.value; //checked
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, valor);

    ///console.log('this.params -->',this.params)
    ///console.log('this.params.value',this.params.value)
    //console.log('this.params.node',this.params.node.data)

    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data,
        node:this.params.node
        // ...something
        ,params:this.params
      }
      this.params.onClick(params); //onClick

    }
  }

  refresh(params: ICellRendererParams): boolean {
    this.params =  this.getValueToDisplay(params)
    return true
  }

  getValueToDisplay(params: ICellRendererParams){

    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  getValue() {
    return this.params.value;
  }

   


}
