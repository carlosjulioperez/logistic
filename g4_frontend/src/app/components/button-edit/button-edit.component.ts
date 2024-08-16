import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-button-edit',
  templateUrl: './button-edit.component.html',
  styleUrls: ['./button-edit.component.scss'],
  imports:[IonicModule],
  standalone:true
})
export class ButtonEditComponent  implements OnInit , ICellRendererAngularComp {

  private params: any;

  constructor() { }

  ngOnInit() {}

  agInit(params: any): void { //ICellRendererParams<any, any, any>
    this.params = params;

  }

  btnClickedHandler(e:any){
    console.log('this.params',this.params)    
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
