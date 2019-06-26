import { Component, ViewChild } from '@angular/core';
import { NavController, Slides ,NavParams, AlertController} from 'ionic-angular';
import { FileManagerApiProvider } from '../../providers/file-manager-api/file-manager-api';
import { environment } from '../../environments/environment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('idle_screen_slider') slider: Slides;
  @ViewChild('pageVideo0') video1;
  APP_MAP_URL: String = "";
  ALL_SYNC_LOG_DATA: any;
  ALL_SYNC_LANE_LOG_DATA: any;
  private serverURL = environment.serverURL;
 
  VM :any;
  constructor(public navCtrl: NavController,params: NavParams,private alertCtrl: AlertController, private filemgrAPI: FileManagerApiProvider) {
    this.VM = {
      slider: {
        enb_autoplay: "true",
        autoplay: "5000",
        loop: "true",
        effect: "slide",
        pager: "true",
        paginationType: "bullets",
        slidesPerView: "1",
        direction: "horizontal",  
        pages:[],
        /*pages: [{
            active: true,
            createdtime: "2019-01-23T05:50:26.603Z",
            id: "5c4800a23c0d231ed8db6421",
            modifiedtime: "2019-01-23T05:50:26.603Z",
            sliderName: "",
            sliderReferenceName: "Temple",
            uploadType: "U",
            url: "assets/images/background/no_file_slider.png",
          }        ],*/
        
      }
    }
  this.getSliders();
  }
  currentIndex: any = 0;
  onSlideChanged() {
    this.currentIndex = this.slider.getActiveIndex();
    console.log('Slide changed! Current index is', this.currentIndex);
  }
  getSliders(){
    this.filemgrAPI.getslider().subscribe(
      (result) => {
        this.VM.slider.pages = result;
      },
      (err) => {
        console.log(err);
        this.showErrrorMg("Slider(s) Failed", err["error"]["message"]);
      }
    );
  }
  showErrrorMg(title, Message){
    let errmsg = this.alertCtrl.create({
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
    errmsg.present();
  }
}
