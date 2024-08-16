import { Component , Injectable  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {Platform , RouterCustomEvent , LoadingController, ToastController,  AlertController , MenuController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { UserService } from './api/user.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
 
 /* public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ]; */
  //public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

 public appPages:any = [] 

 /*public appPages = [
  { id:1, title: 'Home', url: '/home', icon: 'home' },
  { id:2, title: 'Maestros', url: '/coreplantilla', icon: 'library' },
  //{ id:3, title: 'Grupo', url: '/coregrupo', icon: 'color-filter' }, 
  { id:3, title: 'Planificacion Aguaje ', url: '/planificacionaguaje', icon: 'calendar' }, 
  { id:4, title: 'Planificacion Programa ', url: '/planificacionprograma', icon: 'alarm' }, 
  { id:5, title: 'Logistica Despachos ', url: '/logisticadespacho', icon: 'rocket' }, 
  { id:9, title: 'Monitoreo Despachos ', url: '/monitoreodespacho', icon: 'stopwatch' }, 
  //{ id:4, title: 'Usuario', url: '/usuario', icon: 'person' },
  { id:6, title: 'Empleados', url: '/entidad', icon: 'people', subPages:[
    { id:20, title: 'SUsuarios', url: '/usuario', icon: 'person' },
    { id:30, title: 'SEmpleados', url: '/entidad', icon: 'person' },  
  ]  },  
  { id:7, title: 'Control Bines ', url: '/controlbines', icon: 'archive' }, 
  { id:10, title: 'Control Bines - Retorno', url: '/controlbines-retorno', icon: 'archive' }, 
  //{ id:8, title: 'Test Bines ', url: '/demodrapdrop', icon: 'archive' }, 
  { id:8, title: 'Imp.Documentos OPL ', url: '/impresiondocumentos', icon: 'print' }, 
];*/

  username:string = '';
  usuario:string = '';
  
  
  constructor(private storage: Storage , private serviceUser:UserService , 
        private router: Router , public alertController: AlertController ,
        private menu: MenuController ) {

      //(<any>window).pdfWorkerSrc = "assets/pdfjs/pdf.worker.min.js";
      // console.log("assets/pdfjs/pdf.worker.min.js")

  }



  async ngOnInit() {



    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)

    /*
    await this.storage.create();
    await this.serviceUser.getLogin();
    let estado = await this.serviceUser.getLogin();
    console.log("estado es ---->", estado)
    //this.appPages.push({icon: "home",id: 1, idvista: null, title: "Test", url: "test/demogrid"})
    //this.appPages.push({icon: "person", id: 12, idvista: null, subPages: [{id: 1033, title: "Fotos Offline", url: "/fotos-offline", icon: "images", idvista: 12}], title: "General", url: "/"})
    */
    await this.storage.create();
    await this.serviceUser.getLogin();
    console.log("carga appcomponente")
    this.serviceUser.getObservable().subscribe((data) => {
        if(data.user){
            if(data.user == "login"){

                this.aprobarLogin();
                console.log("aprobar login")
              
            }
            if(data.user == "closeSesion"){
              //this.sesionExpirada();
              console.log("cerrar sesion")
            }
        }
    })

    

  }


  public vistas:any = [];

  async aprobarLogin(){
    let estado = await this.serviceUser.getLogin();
    let lista:any = [];

    if(estado){
      this.username = this.serviceUser.usuario.nickname;
      this.usuario  = this.serviceUser.usuario.nombres +" "+this.serviceUser.usuario.apellidos;
      //this.router.navigate(['home']);
      //this.router.navigate(['folder/1'])
      this.router.navigate(['home']);
      this.serviceUser.sn_conexion=false;

      await this.serviceUser.getOpcionesMenubyIdUsuario(this.serviceUser.usuario.id).then( async resp => {
        console.log("resp->" , resp);
        this.vistas =  <any>resp;  
        for (let item of this.vistas) {
          lista.push({id: item.id, title: item.opcion, url: item.rutapagina, icon: item.icono})
        }
        this.appPages = lista;
        console.log(this.appPages);

      }).catch( error => {
        //this.appPages.push({icon: "home",id: 1, idvista: null, title: "Inicio", url: "/home"})
        //this.appPages.push({icon: "person", id: 12, idvista: null, subPages: [{id: 1033, title: "Fotos Offline", url: "/fotos-offline", icon: "images", idvista: 12}], title: "General", url: "/"})
        this.appPages.push({id:1, title: 'Home', url: '/home', icon: 'home'})
      })


    }else{
      console.log('sin token error de logeo....')
    }
  
  }

  cerrarSesion(){
    this.presentAlertConfirm('Atencion', 'Esta seguro que desea cerrar su Sesion  ?').then(resp => {
      if(resp){
        this.serviceUser.deleteLogin();
        //this.estadoMenu(false)
        this.menu.close();
        this.router.navigate([''])
      }
    })
  }

  closeMenu() {
    this.menu.close();
  }
 

  async presentAlertConfirm(titulox:any, mensajex:any) {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        header: titulox,
        message: mensajex,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Cancelar',
            handler: (blah:any) => {
              return resolve(false);
            }
          }, {
            text: 'Aceptar',
            handler: (data:any) => {
              return resolve(true);
            }
          }
        ]
      });
  
      await alert.present();
    });
  }
  

}
