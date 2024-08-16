import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlbinesRetornoPageRoutingModule } from './controlbines-retorno-routing.module';

import { ControlbinesRetornoPage } from './controlbines-retorno.page';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ControlbinesRetornoPageRoutingModule,
    AgGridModule
  ],
  declarations: [ControlbinesRetornoPage]
})
export class ControlbinesRetornoPageModule {}
