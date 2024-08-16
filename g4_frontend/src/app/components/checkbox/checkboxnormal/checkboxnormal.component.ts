//import { Component, OnInit } from '@angular/core';
import { Component  } from '@angular/core';
import { ICellRendererAngularComp } from  'ag-grid-angular';
// implements OnInit {


@Component({
  selector: 'app-checkboxnormal',
  //templateUrl: './checkboxnormal.component.html',  [disabled]="params.value == undefined ? true: false"
  template: `
      <input 
        type="checkbox" 
        (click)="onClick($event)"
        [checked]="params.value"
      />`,
  styleUrls: ['./checkboxnormal.component.scss'],
})
export class CheckboxnormalComponent  implements ICellRendererAngularComp {
  params: any;
 
   agInit(params: any): void {
     this.params = params;
   }
 
   refresh(params?: any): boolean {
     return true;
   }
 
   
 
 //!params.node.id == undefined ? true: false
 
   onClick($event:any) {
     let checked = $event.target.checked;
     console.log('checked -->',checked)
     let colId = this.params.column.colId;
     this.params.node.setDataValue(colId, checked);

     //console.log('this.params -->',this.params)
     //console.log('this.params.value',this.params.value)
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
       this.params.onClick(params);
 
     }
   }

}
