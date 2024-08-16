import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { GestiondespachoPageRoutingModule } from './gestiondespacho-routing.module';

import { GestiondespachoPage } from './gestiondespacho.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestiondespachoPageRoutingModule,
    AgGridModule 
  ],
  declarations: [GestiondespachoPage]
})
export class GestiondespachoPageModule {}
