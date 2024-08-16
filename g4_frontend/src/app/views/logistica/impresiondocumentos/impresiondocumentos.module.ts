import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { ImpresiondocumentosPageRoutingModule } from './impresiondocumentos-routing.module';

import { ImpresiondocumentosPage } from './impresiondocumentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImpresiondocumentosPageRoutingModule,
    AgGridModule
  ],
  declarations: [ImpresiondocumentosPage]
})
export class ImpresiondocumentosPageModule {}
