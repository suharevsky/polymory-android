import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TapticEngine} from '@ionic-native/taptic-engine/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './components/sharedModule';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import { AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from 'src/environments/environment';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Market } from '@ionic-native/market/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DefaultModule } from './layouts/default/default.module';
import { SettingsPageModule } from './pages/settings/settings.module';
import { ProfileEditPageModule } from './pages/profile-edit/profile-edit.module';
import { TinderGoldPageModule } from './pages/tinder-gold/tinder-gold.module';
import { ImageModalPageModule } from './components/image-modal/image-modal.module';
import { PhotosPageModule } from './pages/photos/photos.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import {IonicInputMaskModule} from "@thiagoprz/ionic-input-mask";
import { DeviceGuard } from './guard/device/device.guard';
import { AuthGuard } from './guard/auth/auth.guard';

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
    AngularFirestoreModule,
    AppRoutingModule,
    SharedModule,
    IonicInputMaskModule,
    PhotosPageModule,
    SettingsPageModule,
    ProfileEditPageModule,
    TinderGoldPageModule,
    ImageModalPageModule,
    DefaultModule,
    ServiceWorkerModule.register('combined-sw.js', {
      enabled: environment.production,
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    IonicStorageModule.forRoot(),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TapticEngine,
    DeviceGuard,
    AuthGuard,
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