import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, Platform, AlertController } from '@ionic/angular';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public usuario = {nickname: '', clave:''}
  loading:any
  username:string = '';

  constructor(private router: Router , private platform: Platform, public loadingController: LoadingController,
     public toastController: ToastController, private serviceUser:UserService,
    public alertController: AlertController) {
      this.usuario = { nickname: '', clave:''}
  }

  ngOnInit() {
  }

  limpiar(){
    this.usuario = { nickname: '', clave:''}
  }
   async login(){
      if(this.usuario.clave.trim().length == 0) {
        this.showMessage('Ingrese una clave correcta.')
        return;
      }
      await this.presentLoading();
      //this.usuario["plataforma"] = this.platform.platforms().toString();
      this.serviceUser.postLogin(this.usuario).then(async (resp:any) => {
        this.closeLoading();
        console.log('resp de login',resp)

        await this.serviceUser.saveLogin(<any>resp, 'Bearer ' +(<any>resp).token)
        //this.events.publish('user:login')
        //this.aprobarLogin();
        this.serviceUser.publishAuth({ user:"login" });

      }).catch((err:any) => {
        console.log(err)
        this.showMessage(err.error)
      }).finally( () => {
        this.closeLoading();
      })


      console.log('login....')
      //await this.router.navigate(['']);
       // this.router.navigate(['folder/1'])
   }


   async presentLoading(message='Espere un momento') {
    this.loading = await this.loadingController.create({
      message: message
    });
    await this.loading.present();
  }

  async closeLoading(){
    await this.loading.dismiss();
  }

  async showMessage(messagex:any, positionx:any="bottom", durationx=2000){
    const toast = await this.toastController.create({ 
      message: messagex,
      position: positionx, 
      duration: durationx
    })
    toast.present();
  }


  async aprobarLogin(){
    let estado = await this.serviceUser.getLogin();

    if(estado){
      this.username = this.serviceUser.usuario.nickname;
      //this.router.navigate(['home']);
      //this.router.navigate(['folder/1'])
      this.router.navigate(['home']);
      this.serviceUser.sn_conexion=false;
    }else{
      console.log('sin token error de logeo....')
    }
  
  }


}
