import { Component, Input } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Platform } from 'ionic-angular';

import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RegisterPage } from '../../pages/register/register';
import { TabsPage } from '../../pages/tabs/tabs';
import { AuthProvider } from '../../providers/auth/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../services/util/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../environments/environment';
import { FileManagerApiProvider } from '../../providers/file-manager-api/file-manager-api';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  data: any = {
    "logo": "assets/images/logo/2.png"
  };
  @Input() events: any;
  loginform: FormGroup;
  public username: string;
  public password: string;
  public error: string;
  languages = environment.avail_language;
  selecLang = environment.default_language['id'];
  languageSelect: any;
  private serverURL = environment.serverURL;

  constructor(public navCtrl: NavController,
    public toastCtrl: ToastService,
    private translate: TranslateService,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    private filemgrAPI: FileManagerApiProvider,
    public loadingCtrl: LoadingController,
    public device: Device,
   public platform: Platform
    ) {

    if (localStorage.getItem("SEL_LANGUAGE") != undefined &&
      (localStorage.getItem("SEL_LANGUAGE") == "en" || localStorage.getItem("SEL_LANGUAGE") == "ch")) {
      this.selecLang = (localStorage.getItem("SEL_LANGUAGE"));
    }
    this.languageSelect = {
      "title": "SETTINGS.APP_LANGUAGE",
      "subTitle": "SETTINGS.SELECT_LANGUAGE",
      "selectedItem": "en",
      "items": environment.avail_language
    };
    this.loginform = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
    });

  }
  ionViewDidLoad() {

  }
  ionViewWillEnter() {

  }
  onEvent = (event: string): void => {
    if (event == 'onRegister') {
      this.navCtrl.push(RegisterPage);
    } else if (event == 'onLogin') {
      var logindata: any = {};
      var devicetype:any = {};
      logindata.memberId = this.username;
      logindata.password = this.password;
     logindata.deviceid = this.device.uuid || "0000";
    devicetype = this.platform;
    logindata.devicetype = devicetype._nPlt;
    localStorage.setItem('deviceid', logindata.deviceid);
    localStorage.setItem('devicetype', logindata.devicetype);
      let loder_msg: string;
      this.translate.get('COMMON.LOADER_MSG.LOGIN_LODER').subscribe(t => {
        loder_msg = t;
      });
      /* localStorage.setItem('access_token', 'asd.asdashdkjaskjd.12as');
      localStorage.setItem('USER_INFO', JSON.stringify({"_id":"5b7e6da99cb04c0014ac1585","username":"sivaprakash","email":"sivacalms008@gmail.com","country":"India","city":"Madurai","createdDate":"2018-08-23T08:17:45.029Z","active":true,"__v":0,"token":"asd"}));
      this.navCtrl.setRoot(TabsPage); */
      var login_loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: loder_msg,
        dismissOnPageChange: true,
      });
      login_loader.present();

      this.authProvider.authenticate(logindata).subscribe(
        (result) => {
          if (result) {
            var tmpsliders = [];
            this.filemgrAPI.getslider().subscribe(
              (sliderresult) => {
                var resultdata: any = sliderresult
                resultdata = resultdata.filter(function (sliders) {
                  return sliders.active == true;
                });;
                var serurl = this.serverURL;
                resultdata.forEach(function (sliderdata) {
                  if (sliderdata.uploadType = 'F') {
                    tmpsliders.push({ "htmlBody": '', "url": serurl + sliderdata.url, "type": 'other' });
                  } else {
                    tmpsliders.push({ "htmlBody": '', "url": sliderdata.url, "type": 'other' });
                  }
                });

                login_loader.dismiss();
                this.translate.get('LOGIN.SUCCESS.LOGIN', { username: this.username }).subscribe((res: string) => {
                  this.toastCtrl.create(res);
                });
                this.navCtrl.setRoot(TabsPage, tmpsliders);
                
              },
              (err) => {
                console.log(err);
              }
            );

           
          }
        },
        (err) => {
          console.log(err);
          login_loader.dismiss();
          // this.error = 'Could not authenticate';
          let erMsg = (err.error.errorcode) || 2;
          this.translate.get(['LOGIN.ERROR.LOGIN__FAILED_TITLE',
            'LOGIN.ERROR.LOGIN__FAILED_SUB_TITLE_' + erMsg,
            'LOGIN.SEND_ACT_MAIL',
            'COMMON.OK', 'COMMON.CANCEL']).subscribe(t => {
              let btnArray = [
                {
                  text: t['COMMON.OK'],
                  role: 'cancel',
                  handler: () => {
                  },
                  cssClass: ""
                }
              ];
              if (erMsg == 1) {
                btnArray = [
                  {
                    text: t['COMMON.CANCEL'],
                    role: 'cancel',
                    handler: () => {
                    },
                    cssClass: ""
                  },
                  {
                    text: t['LOGIN.SEND_ACT_MAIL'],
                    role: '',
                    cssClass: "success",
                    handler: () => {
                      this.takeActForResendActMail();
                    }
                  }
                ];
              }

              let loginConfirm = this.alertCtrl.create({
                title: "<span class='failed'>" + t['LOGIN.ERROR.LOGIN__FAILED_TITLE'] + '</span>',
                subTitle: t['LOGIN.ERROR.LOGIN__FAILED_SUB_TITLE_' + erMsg],
                buttons: btnArray
              });
              loginConfirm.present();
            });
        }
      );

    } else if (event == 'onForgot') {
      this.translate.get(['LOGIN.FORGOT_PASS_REQ', 'LOGIN.FORGOT_PASS_REQ_MSG', 'LOGIN.SEND', 'LOGIN.LAB_USER_NAME',
        'COMMON.OK', 'COMMON.CANCEL']).subscribe(t => {
          let alert = this.alertCtrl.create({
            title: "<span class='failed'>" + t['LOGIN.FORGOT_PASS_REQ'] + "</span>",
            subTitle: t['LOGIN.FORGOT_PASS_REQ_MSG'],
            inputs: [
              {
                name: 'memberId',
                type: 'text',
                placeholder: "Member Id"
              }
            ],
            buttons: [
              {
                text: t['COMMON.CANCEL'],
                role: 'cancel',
                handler: data => {
                }
              },
              {
                text: t['LOGIN.SEND'],
                handler: data => {
                  this.takeActionForThisForgotPass(data);
                }
              }
            ]
          });
          alert.present();
        });
    }
  }
  takeActionForThisForgotPass(forgotdata) {
    let loder_msg = "";
    this.translate.get('COMMON.LOADER_MSG.LOADING').subscribe(t => {
      loder_msg = t;
    });
     var forgot_loader = this.loadingCtrl.create({
       spinner: 'bubbles',
       content: loder_msg,
       dismissOnPageChange:true,
     });
     forgot_loader.present();
     let pre_modal = {
    "memberId":forgotdata.memberId
     }
     this.authProvider.forgotPassword(pre_modal).subscribe(data => {
       console.log(data);
       forgot_loader.dismiss();
      if(data.success){
         this.translate.get(['LOGIN.SUCCESS.FORGOT_REQ_MAIL',
           'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
             let loginConfirm = this.alertCtrl.create({
               title: "<span class='success'>" + t['LOGIN.SUCCESS.FORGOT_REQ_MAIL'] + "</span>",
               subTitle: "<div>"+ data.message+ "</div>",
               buttons: [
                 {
                   text: t['COMMON.OK'],
                   role: 'cancel',
                   handler: () => {
                   }
                 }
               ]
             });
             loginConfirm.present();
           });
       } else{
         this.translate.get(['LOGIN.ERROR.FORGOT_REQ_FAILED',
           'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
             let loginConfirm = this.alertCtrl.create({
               title: "<span class='failed'>Forgot password mail send failed !</span>",
               subTitle: "<div>"+ data.message+ "</div>",
               buttons: [
                 {
                  text: t['COMMON.OK'],
                   role: 'cancel',
                   handler: () => {
                   }
                 }
               ]
            });
             loginConfirm.present();
           });
       }
     },
     err => { 
       forgot_loader.dismiss();
       this.translate.get(['LOGIN.ERROR.FORGOT_REQ_FAILED',
       'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
         let loginConfirm = this.alertCtrl.create({
           title: "<span class='failed'>'Forgot password mail send failed !'</span>",
           subTitle: "<div>"+ (err.error.message || "")+ "</div>",
          buttons: [
            {
              text: t['COMMON.OK'],
             role: 'cancel',
              handler: () => {
              }
             }
           ]
         });
         loginConfirm.present();
       });
     });
  }
  takeActForResendActMail() {
    let loder_msg = "";
    this.translate.get('COMMON.LOADER_MSG.LOADING').subscribe(t => {
      loder_msg = t;
    });
    // var resend_loader = this.loadingCtrl.create({
    //   spinner: 'bubbles',
    //   content: loder_msg,
    //   dismissOnPageChange:true,
    // });
    // resend_loader.present();
    // let pre_modal = {
    //   "username":this.username
    // }
    // this.authProvider.resendActMail(pre_modal).subscribe(data => {
    //   console.log(data);
    //   resend_loader.dismiss();
    //   if(data.success){
    //     this.translate.get(['LOGIN.SUCCESS.RESEND_ACT_REQ_MAIL', 'LOGIN.SUCCESS.RESEND_ACT_REQ_MAIL_DETAIL',
    //       'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
    //         let loginConfirm = this.alertCtrl.create({
    //           title: "<span class='success'>" + t['LOGIN.SUCCESS.RESEND_ACT_REQ_MAIL'] + "</span>",
    //           subTitle: t['LOGIN.SUCCESS.RESEND_ACT_REQ_MAIL_DETAIL'],
    //           buttons: [
    //             {
    //               text: t['COMMON.OK'],
    //               role: 'cancel',
    //               handler: () => {
    //               }
    //             }
    //           ]
    //         });
    //         loginConfirm.present();
    //       });
    //   } else{
    //     this.translate.get(['LOGIN.ERROR.RESEND_ACT_REQ_MAIL_FAILED',
    //       'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
    //         let loginConfirm = this.alertCtrl.create({
    //           title: "<span class='failed'>" + t['LOGIN.ERROR.RESEND_ACT_REQ_MAIL_FAILED'] + "</span>",
    //           buttons: [
    //             {
    //               text: t['COMMON.OK'],
    //               role: 'cancel',
    //               handler: () => {
    //               }
    //             }
    //           ]
    //         });
    //         loginConfirm.present();
    //       });
    //   }
    // },
    // err => { 
    //   resend_loader.dismiss();
    //   this.translate.get(['LOGIN.ERROR.RESEND_ACT_REQ_MAIL_FAILED',
    //   'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
    //     let loginConfirm = this.alertCtrl.create({
    //       title: "<span class='failed'>" + t['LOGIN.ERROR.RESEND_ACT_REQ_MAIL_FAILED'] + "</span>",
    //       buttons: [
    //         {
    //           text: t['COMMON.OK'],
    //           role: 'cancel',
    //           handler: () => {
    //           }
    //         }
    //       ]
    //     });
    //     loginConfirm.present();
    //   });
    // });
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
}
