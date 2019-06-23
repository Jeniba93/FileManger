import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,App, AlertController, ToastController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any; 
  alertPresented = false;
  public counter=0;

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private app:App,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
    public alert: AlertController,
    public toastCtrl: ToastController) {
    platform.ready().then(() => {
      this.alertPresented = false;
      let acto = localStorage.getItem('access_token');
      if(acto != undefined && acto != null && acto != ""){
        this.rootPage = TabsPage;
      }else{
        this.rootPage = LoginPage;
      }
      this.initializeTransalate();
      this.initializeApp();
    });
  }
  initializeTransalate() { 
    this.translate.setDefaultLang('en');
    if(localStorage.getItem("SEL_LANGUAGE") != undefined && 
    (localStorage.getItem("SEL_LANGUAGE") == "en" || localStorage.getItem("SEL_LANGUAGE") == "ch")){
      this.translate.use(localStorage.getItem("SEL_LANGUAGE"));
    }else{
      // if (this.translate.getBrowserLang() !== undefined) {
      //     this.translate.use(this.translate.getBrowserLang());
      // } else {
        this.translate.use('en'); // Set your language here
      //}
    }
  }
  initializeApp(){
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
      this.platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
        let activeView = nav.getActive();
        if (activeView != null){
            if (nav.canGoBack()) {
              nav.pop();
            } else if (nav.parent != undefined && nav.parent != null 
               && nav.parent.getSelected() != nav.parent.getByIndex(0)) {
                // goes to the first tab
                nav.parent.select(0);
            } else {
              if (this.counter == 0) {
                this.counter++;
                this.presentToast('Press again to exit');
                setTimeout(() => { this.counter = 0 }, 3000)
              } else {
                this.prepareAppExit();
              }
            }
        }
      });
    });
  }
  presentToast(MSG) {
    let toast = this.toastCtrl.create({
      message: MSG,
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }
  prepareAppExit(){
    this.translate.get(['COMMON.MSG.ARE_SURE_EXIT',
      'COMMON.OK','COMMON.CANCEL','COMMON.EXIT']).subscribe(t => {
        if(!this.alertPresented){
          let confirm = this.alert.create({
            title: t['COMMON.MSG.ARE_SURE_EXIT'],
            buttons: [
                {
                    text: t['COMMON.CANCEL'],
                    role: 'cancel',
                    handler: () => {
                      this.alertPresented = false;
                    }
                },
                {
                    text:  t['COMMON.EXIT'],
                    handler: () => {
                      this.alertPresented = false;
                      this.platform.exitApp();
                    }
                }
            ]
          });
          confirm.present();
          this.alertPresented = true;
        }
      });
  }
}

