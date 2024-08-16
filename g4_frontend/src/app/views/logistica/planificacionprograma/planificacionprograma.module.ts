import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { PlanificacionprogramaPageRoutingModule } from './planificacionprograma-routing.module';

import { PlanificacionprogramaPage } from './planificacionprograma.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionprogramaPageRoutingModule,
    AgGridModule 
  ],
  declarations: [PlanificacionprogramaPage]
})
export class PlanificacionprogramaPageModule {}
