import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { ControlbinesPageRoutingModule } from './controlbines-routing.module';

import { ControlbinesPage } from './controlbines.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlbinesPageRoutingModule,
    AgGridModule
  ],
  declarations: [ControlbinesPage]
})
export class ControlbinesPageModule {}
