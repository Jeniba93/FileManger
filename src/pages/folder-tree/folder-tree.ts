import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FileTreePage } from '../file-tree/file-tree';
import { FileManagerApiProvider } from '../../providers/file-manager-api/file-manager-api';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-folder-tree',
  templateUrl: 'folder-tree.html',
})
export class FolderTreePage {
  VM: any = {};
  LOC_VM: any = {
    noFolders: false,
  }
  
  colorBoxs = ['red-box', 'green-box', 'yellow-box', 'rose-box', 'violet-box', 'blue-box', 'sky-box'];
  constructor(public navCtrl: NavController, private alertCtrl: AlertController, public navParams: NavParams, private filemgrAPI: FileManagerApiProvider) {
    this.VM['folders'] = [];
    this.LOC_VM.noFolders = false;
  }
  ionViewWillEnter1(): boolean{
    let isValidLogin = false;
    if(isValidLogin){
      return true;
    } else {
      return false;
    }
   }
   ionViewWillEnter() {
    this.filemgrAPI.getfolderdetails().subscribe(
      (result) => {
        var folderresult: any = result;

        var folderdetails =
          [
            { "fName": "NP Lumispa", "foldername": "folder1", "fStatus": "new", "fuplaod_date": "2018/11/03 14:21:20", "fupdate_date": "2018/11/03 16:21:20", "ftotal_files": 6,"id":"5d0cb6e9c501db04e8e18b04" },
            { "fName": "New Builder Check List", "foldername": "folder2", "fStatus": "new", "fuplaod_date": "2018/11/03 14:21:20", "fupdate_date": "2018/11/03 16:21:20", "ftotal_files": 0,"id":"2" },
            { "fName": "Presentation", "foldername": "folder3", "fStatus": "new", "fuplaod_date": "2018/11/03 14:21:20", "fupdate_date": "2018/11/03 16:21:20", "ftotal_files": 31,"id":"3" },
            { "fName": "Product Knowledge", "foldername": "folder4", "fStatus": "new", "fuplaod_date": "2018/11/03 14:21:20", "fupdate_date": "2018/11/03 16:21:20", "ftotal_files": 87,"id":"2" },
            { "fName": "Case Flow", "foldername": "folder5", "fStatus": "new", "fuplaod_date": "2018/11/03 14:21:20", "fupdate_date": "2018/11/03 16:21:20", "ftotal_files": 0,"id":"2" }
          ];
        folderdetails.forEach(function (folder) {
          var temfold = folderresult.filter(function (folderres) {
            return folderres._id == folder.id;
          });
          if (temfold.length == 0)
            folder.ftotal_files = 0;
          else
            folder.ftotal_files = temfold[0].count;
        });
        this.VM['folders'] = folderdetails;
        /*this.VM['files'] = [
          {"filename":"Important1.pdf", "fDetails":"Sample Files", "fStatus":"new", "createdtime":"2018/11/03 14:21:20","modifiedtime":"2018/11/03 16:21:20", "ftotal_size":'2.5 MB', "furl":"http://www.africau.edu/images/default/sample.pdf"},
          {"filename":"test.txt", "fDetails":"Sample Files", "fStatus":"", "createdtime":"2018/11/03 14:21:20","modifiedtime":"2018/11/03 16:21:20", "ftotal_size":'2.5 MB', "furl":"http://www.africau.edu/images/default/sample.pdf"},
          {"filename":"Leave Letter.doc", "fDetails":"Sample Files", "fStatus":"new", "createdtime":"2018/11/03 14:21:20","modifiedtime":"2018/11/03 16:21:20", "ftotal_size":'2.5 MB', "furl":"http://www.africau.edu/images/default/sample.pdf"},
          {"filename":"Sample DB.sql", "fDetails":"Sample Files", "fStatus":"", "createdtime":"2018/11/03 14:21:20","modifiedtime":"2018/11/03 16:21:20", "ftotal_size":'2.5 MB', "furl":"http://www.africau.edu/images/default/sample.pdf"},
          {"filename":"myPhoto.jpg", "fDetails":"Sample Files", "fStatus":"", "createdtime":"2018/11/03 14:21:20","modifiedtime":"2018/11/03 16:21:20", "ftotal_size":'2.5 MB', "furl":"http://www.gstatic.com/tv/thumb/v22vodart/3542039/p3542039_v_v8_ac.jpg"},
          {"filename":"myVideo.mp4", "fDetails":"Sample Files", "fStatus":"", "createdtime":"2018/11/03 14:21:20","modifiedtime":"2018/11/03 16:21:20", "ftotal_size":'2.5 MB', "furl":"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"},
        ];*/
      },
      (err) => {
        console.log(err);
        this.showErrrorMg("Folder(s) Failed", err["error"]["message"]);
      }
    );
  }
  goToThisFolder(item, colr) {
    this.navCtrl.push(FileTreePage, { "data": item, "clr": colr });
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
