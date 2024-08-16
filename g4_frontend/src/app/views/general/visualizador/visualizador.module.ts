import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizadorPageRoutingModule } from './visualizador-routing.module';

import { VisualizadorPage } from './visualizador.page';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizadorPageRoutingModule, PdfViewerModule
  ],
  declarations: [VisualizadorPage]
})
export class VisualizadorPageModule {}
