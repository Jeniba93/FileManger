import { Component } from '@angular/core';
import { IonicApp, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { ToastService } from '../../services/util/toast.service';
import { LoginPage } from '../../pages/login/login';
import { UserProfilePage } from '../../pages/user-profile/user-profile';
import { AuthProvider } from '../../providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { AboutPage } from '../about/about';
import { PriceTablePage } from '../price-table/price-table';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  languages = environment.avail_language;
  selecLang = environment.default_language['id'];
  languageSelect: any;
  USER_INFO: any;
  uid;
  deviceid;
  devicetype;
  logoutdata={uid:"",deviceid:"",devicetype:""};

  constructor(public app: IonicApp,
    public _app: App,
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastService,
    private translate: TranslateService,
    private authProvider: AuthProvider) {
    this.deviceid = localStorage.getItem('deviceid');
    this.devicetype = localStorage.getItem('devicetype');
    
    if (localStorage.getItem("SEL_LANGUAGE") != undefined &&
      (localStorage.getItem("SEL_LANGUAGE") == "en" || localStorage.getItem("SEL_LANGUAGE") == "ch")) {
      this.selecLang = (localStorage.getItem("SEL_LANGUAGE"));
    }
    this.languageSelect = {
      "title": "SETTINGS.APP_LANGUAGE",
      "subTitle": "SETTINGS.SELECT_LANGUAGE",
      "selectedItem": this.selecLang,
      "items": environment.avail_language
    };

    if (localStorage.getItem("USER_INFO") != undefined) {
      this.USER_INFO = JSON.parse(localStorage.getItem("USER_INFO"));
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }
  private userUpdateModal:any = {};
  ionViewWillEnter(){
    
  }
  logoutMe() {
this.logoutdata.uid=this.USER_INFO['_id'];
this.logoutdata.deviceid=this.deviceid;
this.logoutdata.devicetype=this.devicetype;
    this.translate.get(['SETTINGS.ARE_U_SURE_LOGOUT_TITLE', 'SETTINGS.ARE_U_SURE_LOGOUT', 'LOGIN.SUCCESS.LOGOUT'
      , 'COMMON.OK', 'COMMON.CANCEL']).subscribe(t => {
        let loginConfirm = this.alertCtrl.create({
          title: "<span class='failed'>" + t['SETTINGS.ARE_U_SURE_LOGOUT_TITLE'] + '</span>',
          subTitle: t['SETTINGS.ARE_U_SURE_LOGOUT'],
          buttons: [
            {
              text: t['COMMON.CANCEL'],
              role: 'cancel',
              handler: () => {
              }
            },
            {
              text: t['COMMON.OK'],
              handler: () => {
                this.authProvider.logout(this.logoutdata).subscribe(
                  (result) => {
                    console.log(result);
                    this._app.getRootNav().setRoot(LoginPage);
                    this.toastCtrl.create(t['LOGIN.SUCCESS.LOGOUT']);
                  },
                  (err) => {
                    this._app.getRootNav().setRoot(LoginPage);
                    this.showErrrorMg("Logout Failed", err["error"]["message"]);
                  }
                );
              }
            }
          ]
        });
        loginConfirm.present();
      });
  }
  showErrrorMg(title, Message){
    let loginConfirm = this.alertCtrl.create({
      title: "<span class='failed'>"+title+"</span>",
      subTitle: Message,
      buttons: [
        {
          text: "OK",
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    loginConfirm.present();
  }
  onChangeLanguage() {
    if (this.languageSelect.selectedItem == "en" || this.languageSelect.selectedItem == "ch") {
      localStorage.setItem("SEL_LANGUAGE", this.languageSelect.selectedItem);
      this.translate.use(this.languageSelect.selectedItem);
      this.translate.get('SETTINGS.LAN_UPDATE_SUCCESS').subscribe((res: string) => {
        this.toastCtrl.create(res);
      });
    }
  }
  goToUserProfile() {
    this.navCtrl.push(UserProfilePage);
  }
  goToUserAbout() {
    this.navCtrl.push(AboutPage);
  }
  goToSubscription() {
    this.navCtrl.push(PriceTablePage);
  }
}
