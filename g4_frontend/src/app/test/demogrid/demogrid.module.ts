import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { DemogridPageRoutingModule } from './demogrid-routing.module';

import { DemogridPage } from './demogrid.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DemogridPageRoutingModule,
    AgGridModule 
  ],
  declarations: [DemogridPage]
})
export class DemogridPageModule {}
