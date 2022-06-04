import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {TapticEngine} from '@ionic-native/taptic-engine/ngx';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';

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
import { SettingsPageModule } from './pages/settings/settings.module';
import { ProfileEditPageModule } from './pages/profile-edit/profile-edit.module';
import { TinderGoldPageModule } from './pages/tinder-gold/tinder-gold.module';
import { ImageModalPageModule } from './components/image-modal/image-modal.module';
import { PhotosPageModule } from './pages/photos/photos.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import {IonicInputMaskModule} from "@thiagoprz/ionic-input-mask";
import { AuthGuard } from './guard/auth/auth.guard';
import { FilterPageModule } from './pages/filter/filter.module';

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
    FilterPageModule,
    TinderGoldPageModule,
    ImageModalPageModule,
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
    AuthGuard,
    Crop,
    Camera,
    File,
    AppVersion,
    InAppBrowser,
    Market,
    InAppPurchase2,
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
