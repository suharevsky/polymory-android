import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../user/user.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {take, tap} from 'rxjs/operators';
import {SettingsService} from '../user/settings/settings.service';
import { ParamsService } from '../params/params.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ModalController } from '@ionic/angular';
import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
  } from '@capacitor/push-notifications';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    public data;

    constructor(private router: Router, public afMessaging: AngularFireMessaging, public db: AngularFirestore, public userService: UserService,
                public http: HttpClient, public settingsService: SettingsService, public paramsService: ParamsService, public modalCtrl: ModalController,
    ) {}


    getMessages() {
        return this.afMessaging.messages;
    }

    public initPush() {

            // On success, we should be able to receive notifications
           PushNotifications.addListener('registration',
            (token: Token) => {

                // token.value
                this.setToken(token.value);
            }
           );
   
           // Some issue with our setup and push will not work
           PushNotifications.addListener('registrationError',
               (error: any) => {
                   console.log('Error on registration: ' + JSON.stringify(error));
               }
           );
   
           
           // Show us the notification payload if the app is open on our device
           PushNotifications.addListener('pushNotificationReceived',
               async (notification: PushNotificationSchema) => {
                   console.log('Push received: ' + JSON.stringify(notification));
               }
           );
   
           // Method called when tapping on a notification
           PushNotifications.addListener(
               'pushNotificationActionPerformed',
               async (notification: ActionPerformed) => {
                    const data = notification.notification.data;
                    data.sender = JSON.parse(data.sender);
                    this.paramsService.set(data);
                   this.router.navigateByUrl(data.page).then(_ => {});
               }
           );
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
                    this.db.collection('push').add({...data, ...{token: data.token}});
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
                    if(data.receiver.status === 1) {
                        this.settingsService.getByUserId(data.receiver.id).subscribe(
                            (options: any) => {
                                if ( options.push.active && options.push.messages ) {
                                    // if woman - set notification once a day, else everytime
                                    if(this.frequency(a.payload.doc.data().lastTimeUse) && data.receiver.gender === 'אישה') {
                                        this.exec(a.payload.doc);
                                    }else {
                                        this.exec(a.payload.doc);
                                   }
                               }
                            }
                        );
                    }
                });
            });
        } catch (e) {
            console.error(e.message)
        }
    }

    public exec(doc) {

        if(doc.data().token) {
            console.log(doc.data().token);
            const id = doc.id;

            this.db.collection('push').doc(id).set({
                lastTimeUse: Date.now()
            },{merge: true});

            const newBody = {
                notification: {
                    title: this.data.title,
                    body: this.data.body,
                    sound: 'default',
                    //icon: 'fcm_push_icon',
                    icon: 'https://polymatch-d1996.web.app/assets/img/web-push-icon.png',
                },
                data: {
                    page: this.data.page,
                    receiver: this.data.receiver || '',
                    sender: this.data.sender || '',
                    modal: this.data.modal
                },
                to: doc.data().token,
                message_id: 111,
                priority: 'high',
                restricted_package_name: '',
                time_to_live: 600
            };

            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: 'key=AAAAuMki404:APA91bHXeyRejUk4l0nSFvU1BGYk4YljFW7oZI1LSDVXnYN0d5YUGkvhGKy_XvJqArvbku-YQd6SsT9vaDKNpMffFMzU0RlKre09cBnX4RetScY1rvmm2KRNa7oxZsrwo-iEvR64uhzO'
                })
            };

            this.http.post('https://fcm.googleapis.com/fcm/send', newBody, httpOptions).subscribe();
        }
    } 
}