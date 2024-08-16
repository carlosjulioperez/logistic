import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams , ICellRendererParams } from 'ag-grid-community';
import { IonicModule } from '@ionic/angular';

//https://www.ag-grid.com/angular-data-grid/component-cell-editor/

@Component({
  selector: 'app-datebox-editor',
  //templateUrl: './datebox-editor.component.html',
  template: `<input #container 
       type="datetime-local"
       name="meeting-time"
       (change)="change($event)"
    />`,
  styleUrls: ['./datebox-editor.component.scss'],
  imports:[IonicModule],
  standalone:true
})
export class DateboxEditorComponent implements ICellEditorAngularComp, AfterViewInit {
 
  params: any;
  //value!: string;

  @ViewChild('container', { read: ViewContainerRef })
  public container!: ViewContainerRef;
  public fechacampo = '';

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    window.setTimeout(() => {
      this.container.element.nativeElement.focus();
    });
  }

  agInit(params: any): void {
    this.params = params;
    this.setFechacampo(params.value);
  }

  getValue(): any {
    return this.fechacampo = this.params.value   //happy ? 'Happy' : 'Sad';
  }

  getValueToDisplay(params: ICellRendererParams){

    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  isPopup(): boolean {
    return true;
  }

  setFechacampo(fechacampo: string): void {
    this.fechacampo = fechacampo;
  }

  toggleMood(): void {
    //this.setHappy(!this.happy);
  }

  change(fechacampo: any) {
    console.log('dio clickk fechacampo' , fechacampo.target.value)
    this.setFechacampo(fechacampo.target.value);
    this.params.api.stopEditing();

    let checked = fechacampo.target.value;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
    console.log('this.params.node' , this.params.node)
    console.log('this.params ' , this.params)

     
  }

  onKeyDown(event: any): void {
    const key = event.key;
    if (
      key === 'ArrowLeft' || // left
      key == 'ArrowRight'
    ) {
      // right
      this.toggleMood();
      event.stopPropagation();
    }
  }
}
