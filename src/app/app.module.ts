import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FileOpener } from '@ionic-native/file-opener';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { ComponentsModule} from '../components/components.module';
import { Device } from '@ionic-native/device';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage} from '../pages/login/login';
import { RegisterPage} from '../pages/register/register';
import { HomePage } from '../pages/home/home';
import { FolderTreePage } from '../pages/folder-tree/folder-tree';
import { FileTreePage } from '../pages/file-tree/file-tree';
import { SettingsPage } from '../pages/settings/settings';
import { UserProfilePage} from '../pages/user-profile/user-profile';
import { PriceTablePage } from '../pages/price-table/price-table';

import { AuthProvider } from '../providers/auth/auth';
import { FileManagerApiProvider } from '../providers/file-manager-api/file-manager-api';
import { ToastService } from '../services/util/toast.service';
import { AboutPage } from '../pages/about/about';
import { VideoPlayerPage } from '../pages/video-player/video-player';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    TabsPage,
    HomePage,
    FolderTreePage,
    FileTreePage,
    SettingsPage,
    UserProfilePage,
    PriceTablePage,
    AboutPage,
    VideoPlayerPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ComponentsModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (HttpLoaderFactory),
            deps: [HttpClient]
        }
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    TabsPage,
    HomePage,
    FolderTreePage,
    FileTreePage,
    SettingsPage,
    UserProfilePage,
    PriceTablePage,
    AboutPage,
    VideoPlayerPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    FileOpener,
    ToastService,
     Device,
     PhotoViewer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    FileManagerApiProvider
  ]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
