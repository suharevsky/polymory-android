import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../user/user.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {take, tap} from 'rxjs/operators';
import {SettingsService} from '../user/settings/settings.service';
import { ParamsService } from '../params/params.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ModalController } from '@ionic/angular';
import { PushAlertComponent } from 'src/app/components/push-alert/push-alert/push-alert.component';
import { StorageService } from '../storage/storageService';


@Injectable({
    providedIn: 'root'
})
export class FcmService {

    public data;
    public options;

    constructor(public afMessaging: AngularFireMessaging, public storage: StorageService, private router: Router, public db: AngularFirestore, public userService: UserService,
                public http: HttpClient, public settingsService: SettingsService, public paramsService: ParamsService, public modalCtrl: ModalController,
    ) {}

    public getOptionsByUserId(id) {
        this.settingsService.getByUserId(id).subscribe(
            options => {
                this.options = options
            }
        );
    }

    requestPermission() {
        return this.afMessaging.requestToken.pipe(
            tap(token => {
                console.log('Token: ',token);
                this.setToken(token);
            })
        )
    }

    getMessages() {
        return this.afMessaging.messages;
    }

    public initPush() {
        this.presentModal();
    }

    async presentModal() {

        let now = new Date();

        let currentTimestamp = now.getTime();

        let pushExpires = await this.storage.get('pushExpires');

        if(currentTimestamp >= pushExpires && pushExpires !== 0) {
            const modal = await this.modalCtrl.create({
                component: PushAlertComponent,
                cssClass: 'dark-bg'
              });
      
              modal.onWillDismiss().then(res => {
                  if (Capacitor.getPlatform() === 'web' && res.data) {
                    this.storage.set('pushExpires', 0)
                      this.registerPush();
                  }else if(!res.data) {
                      this.storage.set('pushExpires', now.setDate(now.getDate() +  7))
                  }
              });
              return await modal.present();
        }
      }

    lastTimeUsageByUserId(id) {
        this.db.collection('push', ref => ref
            .where('user_id', '==', id))
            .get().subscribe(res => {
        });
    }

    // How many times user would receive notification
    // Ex. once a day
    public frequency(time) {
        const result = new Date(time);
        result.setDate(result.getDate() + 1);
        const currentTime = new Date().getTime();
        return +result <= currentTime;
    }

    public setToken(id) {
        // Minus one day in order to get push today
        const time = Date.now() - 86400000;
        const data = {user_id: this.userService.getId(), token: id, lastTimeUse: time};

        try {
            this.db.collection('push', ref => ref
                .where('token', '==', data.token)
                .where('user_id', '==', data.user_id))
                .get().subscribe(res => {
                if (res.empty) {
                    this.db.collection('push').add(data);
                }
            });
        } catch (e) {
            console.log(JSON.stringify(e.message));
        }
    }

    sendPushMessage(data) {
        try {
            this.data = data;
            this.db.collection('push', ref => ref
                .where('user_id', '==', data.receiver.id))
                .snapshotChanges().pipe(take(1)).subscribe(changes => {

                changes.map((a: any) => {
                    const id = a.payload.doc.id;
                    if (this.frequency(a.payload.doc.data().lastTimeUse) && this.options.push.active && this.options.push.messages) {
                        if(a.payload.doc.data().token) {
                            this.exec(a.payload.doc.data().token);
                            this.db.collection('push').doc(id).set({
                                lastTimeUse: Date.now()
                            },{merge: true});
                        }
                   }
                });
            });
        } catch (e) {
            console.error(e.message)
        }
    }

    public exec(token) {
        const newBody = {
            notification: {
                title: this.data.title,
                body: this.data.body,
                sound: 'default',
                //icon: 'fcm_push_icon',
                icon: 'https://polymatch-d1996.web.app/assets/img/web-push-icon.png',
                //click_action: "https://polymatch.co.il"
                click_action: "https://polymory.co.il"
            },
            data: {
                page: this.data.page,
                receiver: this.data.receiver || '',
                sender: this.data.sender || '',
                modal: this.data.modal
            },
            to: token,
            //message_id: 111,
            priority: 'high',
            //restricted_package_name: '',
            //time_to_live: 600
        };

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'key=AAAAuMki404:APA91bHXeyRejUk4l0nSFvU1BGYk4YljFW7oZI1LSDVXnYN0d5YUGkvhGKy_XvJqArvbku-YQd6SsT9vaDKNpMffFMzU0RlKre09cBnX4RetScY1rvmm2KRNa7oxZsrwo-iEvR64uhzO'
            })
        };

        this.http.post('https://fcm.googleapis.com/fcm/send', newBody, httpOptions).subscribe(res => {
        });
    }

    private registerPush() {
        this.requestPermission().subscribe(res => {console.log('requestPermission: ');console.log(res)});
    }

    
}



