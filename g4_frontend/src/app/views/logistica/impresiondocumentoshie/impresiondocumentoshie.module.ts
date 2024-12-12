import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { ImpresiondocumentoshiePageRoutingModule } from './impresiondocumentoshie-routing.module';

import { ImpresiondocumentoshiePage } from './impresiondocumentoshie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImpresiondocumentoshiePageRoutingModule,
    AgGridModule
  ],
  declarations: [ImpresiondocumentoshiePage]
})
export class ImpresiondocumentoshiePageModule {}
