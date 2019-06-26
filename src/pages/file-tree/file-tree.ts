import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileOpener } from '@ionic-native/file-opener';
import { VideoPlayerPage } from '../video-player/video-player';
import { FileManagerApiProvider } from '../../providers/file-manager-api/file-manager-api';
import { environment } from '../../environments/environment';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-file-tree',
  templateUrl: 'file-tree.html',
})
export class FileTreePage {
  VM:any = {};
  colorBoxs = ['red-box','green-box','yellow-box','rose-box','violet-box','blue-box','sky-box'];
  LOC_VM:any = {
    noFiles:false,
  }
  private serverURL = environment.serverURL;
  constructor(private photoViewer: PhotoViewer,public navCtrl: NavController,private alertCtrl: AlertController,
    public navParams: NavParams, private iab: InAppBrowser,private fileOpener: FileOpener
    ,private filemgrAPI: FileManagerApiProvider) {
    this.VM['files'] = [];
    this.LOC_VM.noFiles = false;
    this.VM['sel_folder'] = this.navParams.get('data');
    this.VM['folder_clr'] = this.navParams.get('clr');
    //setTimeout(()=>{
      if(this.VM['sel_folder']['ftotal_files'] === 0){
        this.LOC_VM.noFiles = true;
      }else{
        this.LOC_VM.noFiles = false;
        var foldername=this.VM['sel_folder'].foldername;
        this.filemgrAPI.getfilebyuseraccess(foldername).subscribe(
          (result) => {
            var filesresult:any=result;
            this.VM['files']=filesresult;
            
          },
          (err) => {
            console.log(err);
            this.showErrrorMg("Files(s) Failed", err["error"]["message"]);
          }
        );
       
      }
      
    //},3000);
  }

  ionViewDidLoad() {
  }

  updatefileaccess(data){
    var deviceid =localStorage.getItem('deviceid');
    this.filemgrAPI.updatefileaccess({filename:data._id,foldername:data.foldername,deviceid:deviceid}).subscribe(
      (result) => {
       
      },
      (err) => {
        console.log(err);
        
      }
    );
  }

  openThisFile(data){
    this.updatefileaccess(data);
    let fileclass:string=this.getFileClass(data['filename']);
    if(data.type == "VU"){
      this.navCtrl.push(VideoPlayerPage,data);
    }
    else if (fileclass =='siva-icon-file-image yellow-box'){
      this.viewPhotoWithTitle(data);
    }
    else if (data.type == "F"){
      let browser = this.iab.create(this.serverURL +'/'+data['foldername']+'/'+data['filename'],'_system',{});
      browser.show();
    }else{
      let browser = this.iab.create(data['url'],'_system',{});
      browser.show();
    }
   /*  if((data.filename).split('.')[1] == "mp4"){
      this.navCtrl.push(VideoPlayerPage);
    }else{
      let browser = this.iab.create(data['furl'],'_system',{});
      browser.show();
    } */
    //List Of MIME Types http://svn.apache.org/viewvc/httpd/httpd/trunk/docs/conf/mime.types?view=co
  //   this.fileOpener.open(data['furl'], 'application/pdf')
  // .then(() => console.log('File is opened'))
  // .catch(e => console.log('Error opening file', e));

  }

  //View only photo with title
  viewPhotoWithTitle(data){
    let imageurl:string;
    if (data.type == "F"){
       imageurl= this.serverURL +'/'+data['foldername']+'/'+data['filename'];
    }else{
       imageurl = data['url'];
    }
    this.photoViewer.show(imageurl, data['fname'], {share: false});
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
  getFileClass(fileName){
    let fileExtension = (fileName).split('.').pop();
    let myClass="";
    switch(fileExtension){
      case 'c':case 'class':case 'cpp':case 'html':case 'css':case 'htm':case 'cs':case 'h':
      case 'java':case 'sh':case 'swift':case 'vb':case 'ts':case 'js':case 'php':case 'py':case 'rss':case 'xhtml':case 'cgi':case 'pl':
      case 'asp':case 'aspx':case 'cer':case 'cfm':case 'css':case 'jsp':
        myClass = "siva-icon-doc-inv rose-box";
      break;
      case '3g2':case '3gp':case 'avi':case 'flv':case 'h264':case 'm4v':case 'mkv':case 'mov':
      case 'mp4':case 'mpg':case 'mpeg':case 'rm':case 'swf':case 'vob':case 'wmv':
        myClass = "siva-icon-file-video violet-box";
      break;
      case 'ods':case 'xlr':case 'xls':case 'xslx':
        myClass = "siva-icon-file-excel green-box";
      break;
      case 'jpg':case 'png':case 'gif':case 'jpeg':
      case 'ai':case 'bmp':case 'ps':case 'ico':
      case 'psd':case 'svg':case 'tif':case 'tiff':
        myClass = "siva-icon-file-image yellow-box";
      break;
      case 'pdf':
        myClass = "siva-icon-file-pdf red-box";
      break;
      case 'txt':case 'rtf':
        myClass = "siva-icon-doc-text violet-box";
      break;
      case 'doc': case 'docx':case 'odt':case 'wks':case 'wps':case 'wpd':
        myClass = "siva-icon-file-word sky-box";
      break;
      case 'key':case 'odp':case 'pps':case 'ppt':case 'pptx':
        myClass = "siva-icon-file-powerpoint red-box";
      break;
      case 'zip':case 'rar':case '7z':case 'arj':case 'deb':case 'pkg':case 'rpm':case 'tar':case 'z':
        myClass = "siva-icon-file-archive green-box";
      break;
      default:
        myClass = "siva-icon-doc blue-box";
      break;
    }
    return myClass;
  }
}
