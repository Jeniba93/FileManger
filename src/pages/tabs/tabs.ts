import { Component, ViewChild } from '@angular/core';

import { FolderTreePage } from '../folder-tree/folder-tree';
import { SettingsPage } from '../settings/settings';
import { HomePage } from '../home/home';
import { NavController, Tabs,NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild("myNavTabBar") myNavTabBar: Tabs;
  tab1Root = HomePage;
  tab2Root = FolderTreePage;
  tab3Root = SettingsPage;  
  sliderpages:any;

  constructor(public navCtrl: NavController,params: NavParams) {
    this.sliderpages=params;
  }
  goToFolderTree(){
    //this.navCtrl.setRoot(FolderTreePage);
    this.myNavTabBar.select(1);
  }
}
