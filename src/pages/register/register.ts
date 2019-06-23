import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/util/toast.service';

import { LoginPage } from '../../pages/login/login';
import { AuthProvider } from '../../providers/auth/auth';
import { RegisterModel } from '../../model/registerModel';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  data: any = {
    "logo": "assets/images/logo/2.png"
  };
  regian = "US";
  //register = new RegisterModel();
  register: any = {};
  
  public error: string;
  registerform: FormGroup;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastService,
    private translate: TranslateService,
    private authProvider: AuthProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.registerform = new FormGroup({
      name: new FormControl('', [Validators.required]),
      memberId: new FormControl('', [Validators.required]),
      uplineId: new FormControl(),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),

      subscription: new FormControl(),
      region: new FormControl(),
      dualAccount: new FormControl(),
      //   city: new FormControl('', [Validators.pattern('[a-zA-Z0-9 ]*')]),
    });
    this.register.subscription="Global";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  onEvent = (event: string): void => {
    if (event == 'onRegister') {
      let loder_msg: string;
      this.translate.get('COMMON.LOADER_MSG.REGISTER_LODER').subscribe(t => {
        loder_msg = t;
      });
      var register_loader = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: loder_msg,
        dismissOnPageChange: true,
      });
      register_loader.present();
      if(this.register.password==this.register.confirmPassword)
      {
      
      this.authProvider.register(this.register).subscribe(
        (result) => {
          console.log(result)
          register_loader.dismiss();
          this.translate.get(['REGISTER.SUCCESS.REGISTER_TITLE', 'REGISTER.SUCCESS.REGISTER_SUBTITLE', 'COMMON.OK', 'COMMON.CANCEL']).subscribe(t => {
            let loginConfirm = this.alertCtrl.create({
              title: "<span class='success'>" + t['REGISTER.SUCCESS.REGISTER_TITLE'] + "</span>",
              subTitle: t['REGISTER.SUCCESS.REGISTER_SUBTITLE'],
              buttons: [
                // {
                //   text: 'Cancel',
                //   role: 'cancel',
                //   handler: () => {
                //   }
                // },
                {
                  text: t['COMMON.OK'],
                  role: 'cancel',
                  handler: () => {
                    this.navCtrl.setRoot(LoginPage);
                  }
                }
              ]
            });
            loginConfirm.present();
          });
        },
        (err) => {
          register_loader.dismiss();
          this.error = 'Registration failed (' + err.error.message + ')';
          this.translate.get(['REGISTER.ERROR.REG_FAILED_TITLE', 'REGISTER.ERROR.REG_FAILED_SUB_TITLE', 'COMMON.OK', 'COMMON.CANCEL']).subscribe(t => {
            let loginConfirm = this.alertCtrl.create({
              title: "<span class='failed'>" + t['REGISTER.ERROR.REG_FAILED_TITLE'] + "</span>",
              subTitle: t['REGISTER.ERROR.REG_FAILED_SUB_TITLE']
                + "<div>" + err.error.message + "</div>",
              buttons: [
                // { 
                //   text: 'Cancel',
                //   role: 'cancel',
                //   handler: () => {
                //   }
                // },
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
      );
    }
    else
    {
      register_loader.dismiss();
      this.error = 'Registration failed (Password mismatch)';
      this.translate.get(['REGISTER.ERROR.REG_FAILED_TITLE', 'REGISTER.ERROR.REG_FAILED_SUB_TITLE', 'COMMON.OK', 'COMMON.CANCEL']).subscribe(t => {
        let loginConfirm = this.alertCtrl.create({
          title: "<span class='failed'>Password Mismatch</span>",
          subTitle: t['REGISTER.ERROR.REG_FAILED_SUB_TITLE']
            + "<div>Password and Confirm Password should be match</div>",
          buttons: [
            // { 
            //   text: 'Cancel',
            //   role: 'cancel',
            //   handler: () => {
            //   }
            // },
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

    } else if (event == 'onGoBack') {
      this.navCtrl.pop();
    }
  }
}
