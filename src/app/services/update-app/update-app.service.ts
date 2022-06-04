import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { UpdateApp } from 'src/app/interfaces/update-app';
import { environment } from 'src/environments/environment.prod';
import { Market } from '@ionic-native/market/ngx';

@Injectable({
  providedIn: 'root'
})
export class UpdateAppService {

  API_URL = `${environment.apiUrl}/adminSettings`;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private appVersion: AppVersion,
    //private iab: InAppBrowser,
    private market: Market,
    private platform: Platform
  ) { }

  async checkForUpdate() {
    this.http.get<any>(this.API_URL).pipe(map(res => {
      return res[0].versionUpdate;
    })).subscribe(async (info: UpdateApp) => {
      if(!info.enabled) {
        this.presentAlert(info.msg.title, info.msg.msg);
      }else{

        const versionNuumber = await this.appVersion.getVersionNumber();
        const spliteddVersion = versionNuumber.split('.');
        const serverVersion = info.current.split('.');

        if(serverVersion[0] > spliteddVersion[0]) {
          this.presentAlert(info.majorMsg.title, info.majorMsg.msg, info.majorMsg.btn);
        }else if(serverVersion[1] > spliteddVersion[1]){
          this.presentAlert(info.minorMsg.title, info.minorMsg.msg, info.minorMsg.btn, true);
        }
      }
    })
  }

  openAppstoreEntry() {
    if(this.platform.is('android')) {
      this.market.open('il.co.polymatch');
    }
  }

  async presentAlert(header, message, buttonText = '', allowClose = false) {
    const buttons = [];

    if(buttonText != '') {
      buttons.push({
        text: buttonText,
        handler: () => {
          this.openAppstoreEntry();
        }
      });
    }

    if(allowClose){
      buttons.push({
        text: 'ביתול',
        role: 'Cancel,'
      });
    }

    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons,
      backdropDismiss : allowClose
    });

    await alert.present();
  }
}
