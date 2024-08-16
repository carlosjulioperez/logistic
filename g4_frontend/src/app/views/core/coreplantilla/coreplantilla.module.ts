import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { IonicModule } from '@ionic/angular';

import { CoreplantillaPageRoutingModule } from './coreplantilla-routing.module';

import { CoreplantillaPage } from './coreplantilla.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CoreplantillaPageRoutingModule,
    AgGridModule 
  ],
  declarations: [CoreplantillaPage]
})
export class CoreplantillaPageModule {}
