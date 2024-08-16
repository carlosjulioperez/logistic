import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button-generate',
  templateUrl: './button-generate.component.html',
  styleUrls: ['./button-generate.component.scss'],
  imports:[IonicModule],
  standalone:true
})
export class ButtonGenerateComponent  implements OnInit , ICellRendererAngularComp {

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
