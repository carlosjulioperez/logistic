import { Component  } from '@angular/core';
import { ICellRendererAngularComp } from  'ag-grid-angular';

@Component({
  selector: 'app-button-generate-native',
  templateUrl: './button-generate-native.component.html',
  styleUrls: ['./button-generate-native.component.scss'],
})
export class ButtonGenerateNativeComponent  implements ICellRendererAngularComp {
  params: any;
 
   agInit(params: any): void {
     this.params = params;
   }
 
   refresh(params?: any): boolean {
     return true;
   }
 
   
 
 //!params.node.id == undefined ? true: false
 
   onClick($event:any) {
     let value = $event.target.value;
     console.log('value -->',value)
     //let colId = this.params.column.colId;
     //this.params.node.setDataValue(colId, value);

     //console.log('this.params -->',this.params)
     //console.log('this.params.value',this.params.value)
      console.log('this.params.node',this.params.node.data)
 
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
