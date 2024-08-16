import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',//login //demogrid demodrapdrop
    pathMatch: 'full' 
  }, 
  /*{
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },*/
  {
    path: 'folder', //path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'demogrid',
    loadChildren: () => import('./test/demogrid/demogrid.module').then( m => m.DemogridPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'coregrupo',
    loadChildren: () => import('./views/core/coregrupo/coregrupo.module').then( m => m.CoregrupoPageModule)
  },
  {
    path: 'coregrupomodal',
    loadChildren: () => import('./views/core/coregrupomodal/coregrupomodal.module').then( m => m.CoregrupomodalPageModule)
  },
  {
    path: 'coreplantilla',
    loadChildren: () => import('./views/core/coreplantilla/coreplantilla.module').then( m => m.CoreplantillaPageModule)
  },
  {
    path: 'planificacionaguaje',
    loadChildren: () => import('./views/logistica/planificacionaguaje/planificacionaguaje.module').then( m => m.PlanificacionaguajePageModule)
  },
  {
    path: 'planificacionprograma',
    loadChildren: () => import('./views/logistica/planificacionprograma/planificacionprograma.module').then( m => m.PlanificacionprogramaPageModule)
  },
  {
    path: 'logisticadespacho',
    loadChildren: () => import('./views/logistica/logisticadespacho/logisticadespacho.module').then( m => m.LogisticadespachoPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'controlbines',
    loadChildren: () => import('./views/logistica/controlbines/controlbines.module').then( m => m.ControlbinesPageModule)
  },
  {
    path: 'demodrapdrop',
    loadChildren: () => import('./test/demodrapdrop/demodrapdrop.module').then( m => m.DemodrapdropPageModule)
  },
  {
    path: 'impresiondocumentos',
    loadChildren: () => import('./views/logistica/impresiondocumentos/impresiondocumentos.module').then( m => m.ImpresiondocumentosPageModule)
  },  {
    path: 'monitoreodespacho',
    loadChildren: () => import('./views/logistica/monitoreodespacho/monitoreodespacho.module').then( m => m.MonitoreodespachoPageModule)
  },
  {
    path: 'controlbines-retorno',
    loadChildren: () => import('./views/logistica/controlbines-retorno/controlbines-retorno.module').then( m => m.ControlbinesRetornoPageModule)
  },
  {
    path: 'visualizador',
    loadChildren: () => import('./views/general/visualizador/visualizador.module').then( m => m.VisualizadorPageModule)
  },
  {
    path: 'visor',
    loadChildren: () => import('./views/reporte/visor/visor.module').then( m => m.VisorPageModule)
  },
  {
    path: 'reportegeneral',
    loadChildren: () => import('./views/logistica/reportegeneral/reportegeneral.module').then( m => m.ReportegeneralPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
