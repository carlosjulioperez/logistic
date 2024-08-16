import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { PlanificacionaguajePageRoutingModule } from './planificacionaguaje-routing.module';

import { PlanificacionaguajePage } from './planificacionaguaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanificacionaguajePageRoutingModule,
    AgGridModule 
  ],
  declarations: [PlanificacionaguajePage]
})
export class PlanificacionaguajePageModule {}
