import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-video-player',
  templateUrl: 'video-player.html',
})
export class VideoPlayerPage {
filedetails:any;
MY_CONTROL_OPTIONS:string =""; 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.filedetails=navParams.data;
    this.MY_CONTROL_OPTIONS = "nodownload";
    //nodownload nofullscreen noremoteplayback
    //https://developers.google.com/web/updates/2017/03/chrome-58-media-updates#controlslist
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPlayerPage');
  }

}
