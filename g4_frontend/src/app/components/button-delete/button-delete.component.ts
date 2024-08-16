import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-button-delete',
  templateUrl: './button-delete.component.html',
  styleUrls: ['./button-delete.component.scss'],
  imports:[IonicModule],
  standalone:true
})
export class ButtonDeleteComponent  implements OnInit , ICellRendererAngularComp {

  private params: any;

  constructor() { }

  ngOnInit() {}

  agInit(params: any): void { //ICellRendererParams<any, any, any>
    this.params = params;

  }

  btnClickedHandler(e:any){
    this.params.clicked(this.params.data);
  }

  refresh(params: ICellRendererParams): boolean {
    this.params =  this.getValueToDisplay(params)
    return true
  }

  getValueToDisplay(params: ICellRendererParams){

    return params.valueFormatted ? params.valueFormatted : params.data;
  }

}