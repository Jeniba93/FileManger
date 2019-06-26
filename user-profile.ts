import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { ToastService } from '../../services/util/toast.service';
import { AuthProvider } from '../../providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterModel } from '../../model/registerModel';
import { FileManagerApiProvider } from '../../providers/file-manager-api/file-manager-api';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  data: any = {
    "logo": "assets/images/logo/2.png"
  };
  userUpdateModal = new RegisterModel();
  public error: string;
  userProfile:FormGroup;
  USER_INFO:any;
  passModal:any = {
    currentPassword:"",
    newPassword:""
  }
  translation:any = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fileManagerApiProvider:FileManagerApiProvider,
    public toastCtrl: ToastService,
    private translate:TranslateService,
    private authProvider:AuthProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {
      let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
      this.userProfile = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 ]*'), Validators.minLength(4), Validators.maxLength(20)]),
        //password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
         region: new FormControl('', [Validators.pattern('[a-zA-Z0-9 ]*')]),
         accessLevel: new FormControl('', [Validators.pattern('[0-3]*')]),
        uplineId: new FormControl('', [Validators.pattern('[a-zA-Z0-9 ]*')]),
        subscription: new FormControl(),
        expirydate: new FormControl(), 
        memberId: new FormControl(), 
      });
      if(localStorage.getItem("USER_INFO") != undefined){
        this.USER_INFO = JSON.parse(localStorage.getItem("USER_INFO"));
        // this.USER_INFO['region']= "CN";
        //  this.USER_INFO['name']="xxx";
        // this.USER_INFO['subscription']= "Regional";
        // this.USER_INFO['accessLevel']= 3;
        // this.USER_INFO['validityDate']= "04/02/1993";
        // this.USER_INFO['memberId']= "MBRID45";
        // this.USER_INFO['uplineId']= "UP345";   
        var date = new Date(this.USER_INFO['expirydate']);
        this.USER_INFO['expirydate']=  date.getDate()+ '/' +(date.getMonth() + 1) + '/' +  date.getFullYear();  
        this.userUpdateModal.name = this.USER_INFO['name'];
        this.userUpdateModal.email = this.USER_INFO['email'];
        this.userUpdateModal.subscription = this.USER_INFO['subscription'];
        this.userUpdateModal.region = this.USER_INFO['region'];
        this.userUpdateModal.accessLevel = this.USER_INFO['accessLevel'];
        //this.USER_INFO['expirydate']=(new Date(this.USER_INFO['expirydate'])).toLocaleDateString();
        this.userUpdateModal.expirydate =this.USER_INFO['expirydate'];
        this.userUpdateModal.uplineId = this.USER_INFO['uplineId'];
        this.userUpdateModal.memberId = this.USER_INFO['memberId'];
        this.userUpdateModal._id = this.USER_INFO['_id'];
      }
      // this.translate.get(['USER_PROFILE.ERROR.OLD_PASSWORD_REQUIRED', 'USER_PROFILE.ERROR.OLD_PASSWORD_MIN4',
      // 'USER_PROFILE.ERROR.OLD_PASSWORD_MAX20','USER_PROFILE.ERROR.NEW_PASSWORD_REQUIRED', 'USER_PROFILE.ERROR.NEW_PASSWORD_MIN4',
      // 'USER_PROFILE.ERROR.NEW_PASSWORD_MAX20']).subscribe(t => {
      //   this.translation = t;
      // });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
    
  onEvent = (event: string): void => {
    
     if (event == 'onUpdateProfile') {
       let loder_msg:string;
       this.translate.get('COMMON.LOADER_MSG.REGISTER_LODER').subscribe(t => {
         loder_msg = t;
       });
       var register_loader = this.loadingCtrl.create({
         spinner: 'bubbles',
         content: loder_msg,
         dismissOnPageChange:true,
       });
      // register_loader.present();
         this.authProvider.updateProfile(this.userUpdateModal).subscribe(
           (result) => {
             register_loader.dismiss();
             this.translate.get(['USER_PROFILE.SUCCESS.REGISTER_TITLE','USER_PROFILE.SUCCESS.REGISTER_SUBTITLE','COMMON.OK','COMMON.CANCEL']).subscribe(t => {
               let loginConfirm = this.alertCtrl.create({
                title: "<span class='success'>" + t['USER_PROFILE.SUCCESS.REGISTER_TITLE'] + "</span>",
                 subTitle: t['USER_PROFILE.SUCCESS.REGISTER_SUBTITLE'],
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
           },
           (err) => {
             register_loader.dismiss();
             this.error = 'Registration failed ('+ err.error.message +')';
             this.translate.get(['USER_PROFILE.ERROR.REG_FAILED_TITLE','USER_PROFILE.ERROR.REG_FAILED_SUB_TITLE','COMMON.OK','COMMON.CANCEL']).subscribe(t => {
               let loginConfirm = this.alertCtrl.create({
                 title: "<span class='failed'>" + t['USER_PROFILE.ERROR.REG_FAILED_TITLE'] + "</span>",
                 subTitle: t['USER_PROFILE.ERROR.REG_FAILED_SUB_TITLE'] 
               +"<div>"+ err.error.message+ "</div>",
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
        );
     } 
    else if (event == 'onChangePassword') {
      this.translate.get(['USER_PROFILE.CHANGE_PASSWORD','USER_PROFILE.NEW_PASS','USER_PROFILE.OLD_PASS','USER_PROFILE.CHANGE',
      'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
        let alert = this.alertCtrl.create({
          title: '<span class="failed">' + t['USER_PROFILE.CHANGE_PASSWORD'] + '</span>',
          inputs: [
            {
              name: 'currentPassword',
              type: 'password',
              placeholder: t['USER_PROFILE.OLD_PASS']
            },
            {
              name: 'newPassword',
              placeholder: t['USER_PROFILE.NEW_PASS'],
              type: 'password'
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
              text: t['USER_PROFILE.CHANGE'],
              handler: data => {
                let _newPassword = (data.newPassword).toString().trim();
                let _oldPassword = (data.currentPassword).toString().trim();
                if( _oldPassword.length == 0){
                  this.toastCtrl.create(this.translation['USER_PROFILE.ERROR.OLD_PASSWORD_REQUIRED']);
                  return false;
                } else if( _oldPassword.length > 20){
                  this.toastCtrl.create(this.translation['USER_PROFILE.ERROR.OLD_PASSWORD_MAX20']);
                  return false;
                } else if(_oldPassword.length < 4){
                  this.toastCtrl.create(this.translation['USER_PROFILE.ERROR.OLD_PASSWORD_MIN4']);
                  return false;
                } else if( _newPassword.length == 0){
                  this.toastCtrl.create(this.translation['USER_PROFILE.ERROR.NEW_PASSWORD_REQUIRED']);
                  return false;
                } else if( _newPassword.length > 20){
                  this.toastCtrl.create(this.translation['USER_PROFILE.ERROR.NEW_PASSWORD_MAX20']);
                  return false;
                } else if(_newPassword.length < 4){
                  this.toastCtrl.create(this.translation['USER_PROFILE.ERROR.NEW_PASSWORD_MIN4']);
                  return false;
                } else if(_oldPassword.length >= 4 && _oldPassword.length <= 20 && 
                  _newPassword.length >= 4 && _newPassword.length <= 20){
                  this.takeActionForChangePassword({currentPassword:_oldPassword, newPassword:_newPassword});
                }
              }
            }
          ]
        });
        alert.present();
      });
    }
  }
  takeActionForChangePassword(passData){
    let loder_msg:string;
    this.translate.get('COMMON.LOADER_MSG.LOADING').subscribe(t => {
      loder_msg = t;
    });
     var changePass_loader = this.loadingCtrl.create({
       spinner: 'bubbles',
      content: loder_msg,
      dismissOnPageChange:true,
   });
     changePass_loader.present();
     this.authProvider.changepassword(passData).subscribe(data => {
      console.log(data);
      changePass_loader.dismiss();
    this.translate.get(['USER_PROFILE.SUCCESS.CHANGE_PASS_SUCCESS',
       'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
         let loginConfirm = this.alertCtrl.create({
           title: "<span class='success'>" + t['USER_PROFILE.SUCCESS.CHANGE_PASS_SUCCESS'] + "</span>",
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
     },
     (err) => { 
       changePass_loader.dismiss();
      this.translate.get(['USER_PROFILE.ERROR.CHANGE_PASS_ERROR',
      'COMMON.OK','COMMON.CANCEL']).subscribe(t => {
        let loginConfirm = this.alertCtrl.create({
          title: "<span class='failed'>" + t['USER_PROFILE.ERROR.CHANGE_PASS_ERROR'] + "</span>",
          subTitle:"<div>"+ (err.error.message || "")+ "</div>",
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
}
