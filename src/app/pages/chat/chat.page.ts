import {Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonContent, ModalController, NavParams, ToastController} from '@ionic/angular';
import {Observable, Subscription} from 'rxjs';
import {ChatService} from '../../services/chat/chat.service';
import {UserModel} from '../../models/user.model';
import {UserService} from '../../services/user/user.service';
import {DateHelper} from '../../helpers/date.helper';
import {CounterService} from '../../services/counter/counter.service';
import {FcmService} from '../../services/fcm/fcm.service';
import {ProfilePage} from '../profile/profile.page';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

    chat$: Observable<any>;
    user: UserModel;
    blockList: any[];
    newMsg: string;
    chatId: string;
    messages: any[];
    typingMessage = '';
    imageRequestMessage = [];
    interlocutorId = '';
    blockedMessage = '';
    showGiphy = false;
    dialogueExists: boolean;
    subscription: Subscription;
    @ViewChild(IonContent, {static: false}) content: IonContent;

    constructor(
        public chatService: ChatService,
        public userService: UserService,
        public counterService: CounterService,
        private modalCtrl: ModalController,
        private alertController: AlertController,
        public toastController: ToastController,
        public fcmService: FcmService,
        public navParams: NavParams,
    ) {
        this.chatId = this.navParams.get('chatId');
        this.dialogueExists = this.navParams.get('chatExists');
        this.interlocutorId = this.navParams.get('profileId');

        this.init();
    }

    init() {
        // TODO: can be your API response
        this.messages = [];
    }

    close() {
        this.modalCtrl.dismiss();
    }

    ionViewDidLeave() {
        console.log('ionViewDidLeave');
        this.subscription.unsubscribe();
    }

    getListData(type, userId) {
        return this.userService.getListData(type, userId);
    }

    async imageConfirmation() {
        let pushData = {};
        const alert = await this.alertController.create({
            header: 'אישור תמונה פרטית',
            message: 'האם תרצה לתת אפשרות לראות את התמונות הפרטיות שלך?',
            backdropDismiss:false,
            buttons: [{
                text: 'לא',
                role: 'cancel',
                handler: () => {
                     pushData = {
                         title: 'JoyMe', 
                         body: 'בקשת התמונה נדחתה ❌', 
                         page: 'tabs/highlights', 
                         modal: true,
                         receiver: this.chatService.interlocutor,
                         sender: this.userService.user
                        };
                    this.fcmService.sendPushMessage(pushData);
                    this.chat$.pipe(take(1)).subscribe(chat => {
                    this.chatService.removeImageRequestMessage(chat, this.chatId);
                    });
                    this.userService.setList('requestImage',this.userService.user.id,this.chatService.interlocutor.id).subscribe()
                }
            }, {
                text: 'כן',
                handler: () => {
                     pushData = {
                         title: 'JoyMe', 
                         body: 'בקשת התמונה התקבלה ✅', 
                         page: 'tabs/highlights',
                         modal: true,
                         receiver: this.chatService.interlocutor,
                         sender: this.userService.user
                        };
                     this.fcmService.sendPushMessage(pushData);
                     this.userService.updateList('requestImage', this.userService.user.id,this.chatService.interlocutor.id,true).subscribe();
                     this.chat$.pipe(take(1)).subscribe(chat => {
                        this.chatService.removeImageRequestMessage(chat, this.chatId);
                    });
                }
            }]
        });
        await alert.present();
    }

    getDialogue() {

        const source = this.chatService.get(this.chatId);

        this.chat$ = this.chatService.joinUsers(source);

        this.subscription = this.chat$.subscribe(chat => {

            this.fcmService.getOptionsByUserId(this.interlocutorId);

            if (chat.messages.length > 0) {
                this.imageRequestMessage = chat.messages.filter(msg => msg.imageRequest && !msg.delivered && this.userService.user.id !== msg.uid);

                if(this.imageRequestMessage.length !== 0) {
                    this.imageRequestMessage = [];
                    this.imageConfirmation();
                }

                this.chatService.setMessagesAsReceived(chat, this.userService.user, this.chatId);
                this.counterService.setByUserId(this.userService.user.id, 0, 'newMessages');

                chat.messages.map((message, i) => {
                    message.time = DateHelper.getCurrentTime(message.createdAt);
                    const date = DateHelper.formatMovementDate(message.createdAt, 'he-IL');
                    message.date = date;

                    message.date =  (i === 0 || (i > 0 && (message.date !== chat.messages[i - 1].date))) ? date : '';
                    
                    return message;
                })
            }
            this.scrollToBottom(null, true);
        });
    }

    async viewProfile(profile) {
        const modal = await this.modalCtrl.create({
            component: ProfilePage,
            componentProps: {
                profile,
            }

        });
        return await modal.present();
        // this.navCtrl.navigateForward(`/profile/${user.id}`, user);
    }

    ngOnInit() {

        this.userService.getById(this.interlocutorId).subscribe(user => {
            this.chatService.interlocutor = user;
            this.getListData('blockList', this.chatService.interlocutor.id).subscribe((res: any) => {
                if (!res.empty) {
                    this.blockedMessage = 'המשתמש הוסיף אותך לרשימה השחורה';
                } else {
                    if (this.dialogueExists) {
                        this.getDialogue();
                    }
                }
            });
        });
        this.userService.getUser();
    }

    submit() {

        if (!this.newMsg) {
            return;
        }

        this.chatService.sendMessage(this.chatId, this.newMsg, this.userService.user.id).then(_ => {

            if (!this.dialogueExists) {
                this.chatService.setDialogue(this.chatId).subscribe(res => {
                    this.getDialogue();
                });
            }

            const pushData = {title: 'JoyMe', body: 'קיבלת הודעה חדשה', page: 'tabs/matches', modal: false, sender: this.userService.user, receiver: this.chatService.interlocutor};

            // Sending push only to active users
            if (this.chatService.interlocutor.status === 1) {
                this.fcmService.sendPushMessage(pushData);
            }

            // Set counter for unread messages
            this.counterService.setByUserId(this.chatService.interlocutor.id, -1, 'newMessages');

            setTimeout(() => {
                this.scrollToBottom();
            }, 300);
        });
        this.newMsg = '';
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000
        });
        toast.present();
    }

    trackByCreated(i, msg) {
        return msg.createdAt;
    }

    scrollToBottom(duration = 500, isFirstLoad = false) {
        if (isFirstLoad) {
            setTimeout(() => {
                this.content.scrollToBottom(duration).then(r => '');
            }, 500);
        } else {
            this.content.scrollToBottom(duration).then(r => '');
        }
    }

    onInputSizeChange() {
        setTimeout(() => {
            this.scrollToBottom();
        }, 0);
    }

    nl2br(text: string) {
        if (!text) return text;
        return text.replace(/\n/gi, '<br>');
    }
}