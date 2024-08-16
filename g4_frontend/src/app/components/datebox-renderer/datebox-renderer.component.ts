import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import * as moment from 'moment';

@Component({
  selector: 'app-datebox-renderer',
  //templateUrl: './datebox-renderer.component.html',  
  template: `<input type="text" [value]="valor" style="height:20px; width:100%;" readonly />`, //<img width="20px" [src]="imgForMood" />
  styleUrls: ['./datebox-renderer.component.scss'],
})
export class DateboxRendererComponent  implements ICellRendererAngularComp {
  public params!: ICellRendererParams;
  public fechacampo!: string;
  public valor!: string;  //imgForMood

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.setFechacampo(params);
    //console.log('init params.value' , params.value )
  }

  refresh(params: any): boolean {
    //console.log('refresh.params' , params.value )
    this.params = params;
    this.setFechacampo(params);
    return true;
  }

  private setFechacampo(params: ICellRendererParams) { //setMood
   // console.log('params.value' , params.value )
    this.fechacampo = params.value;
    //this.valor = this.fechacampo;
    this.valor = moment(this.fechacampo).format('MM/DD/YYYY HH:mm')
    /*this.imgForMood =
      'https://www.ag-grid.com/example-assets/smileys/' +
      (this.mood === 'Happy' ? 'happy.png' : 'sad.png'); */
  }

}
