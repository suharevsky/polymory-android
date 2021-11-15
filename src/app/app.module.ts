import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TapticEngine} from '@ionic-native/taptic-engine/ngx';
import {IonicStorageModule} from '@ionic/storage';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './components/sharedModule';
import {SettingsPageModule} from './pages/settings/settings.module';
import {ProfileEditPageModule} from './pages/profile-edit/profile-edit.module';
import {MatchedModalPageModule} from './pages/matched-modal/matched-modal.module';
import {TinderGoldPageModule} from './pages/tinder-gold/tinder-gold.module';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from 'src/environments/environment';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot({
      mode: 'ios',
      backButtonText: '',
      // swipeBackEnabled: false,
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'tinder',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    SharedModule,
    SettingsPageModule,
    ProfileEditPageModule,
    MatchedModalPageModule,
    TinderGoldPageModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TapticEngine,
    Crop,
    Camera,
    File,
    AppVersion,
    InAppBrowser,
    Market,
    /*{
        provide: APP_INITIALIZER,
        useFactory: appInitializer,
        multi: true,
        deps: [AuthService],
    },*/ {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
