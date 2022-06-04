import {Component, OnInit, Pipe, ViewChild} from '@angular/core';
import {AlertController, IonContent, ModalController, NavController, NavParams, ToastController} from '@ionic/angular';
import {Observable, Subscription} from 'rxjs';
import {ChatService} from '../../services/chat/chat.service';
import {UserModel} from '../../models/user.model';
import {UserService} from '../../services/user/user.service';
import {DateHelper} from '../../helpers/date.helper';
import {CounterService} from '../../services/counter/counter.service';
import {FcmService} from '../../services/fcm/fcm.service';
import {ProfilePage} from '../profile/profile.page';
import { map, take } from 'rxjs/operators';

import { ImageModalPage } from 'src/app/components/image-modal/image-modal.page';
import { GeneralService } from 'src/app/services/general/general.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { StateChange } from 'ng-lazyload-image';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { TinderGoldPage } from '../tinder-gold/tinder-gold.page';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.page.html',
    styleUrls: ['./chat.page.scss'],
})

export class ChatPage implements OnInit {

    chat$: Observable<any>;
    user: UserModel;
    blockList: any[];
    chatId: string;
    //messages: any[];
    errMessage: string;
    updatedDialogue = true;
    imagesError = []; 

    //typingMessage = '';
    currentMessage = {
        type: '',
        base64: '',
        imageName: '',
        content: ''
    }
    typeMessage = '';
    temporaryMessage = '';
    imageRequestMessage = [];
    interlocutorId = '';
    blockedMessage = '';
    showGiphy = false;
    uploadPercentage = 0;
    dialogueExists: boolean;
    subscription: Subscription;
    @ViewChild(IonContent, {static: false}) content: IonContent;

    constructor(
        public chatService: ChatService,
        public userService: UserService,
        public counterService: CounterService,
        public navCtrl: NavController,
        private modalCtrl: ModalController,
        private alertController: AlertController,
        public toastController: ToastController,
        public fcmService: FcmService,
        public navParams: NavParams,
        public generalService: GeneralService,
        private afStorage: AngularFireStorage,
        private route: ActivatedRoute,
        private camera: Camera,
        

    ) {
        this.chatId = this.navParams.get('chatId');
        this.dialogueExists = this.navParams.get('chatExists');
        this.interlocutorId = this.navParams.get('profileId');
        this.init();
    }

    init() {
        // TODO: can be your API response
       // this.messages = [];
    }

    ngOnInit() {}

    close() {
        this.modalCtrl.dismiss();
    }

    ionViewDidLeave() {
        this.generalService.currentPage.next("");
        this.subscription.unsubscribe();
    }

    getListData(type, userId) {
        return this.userService.getListData(type, userId);
    }

    async openPreview(img) {
        const modal = await this.modalCtrl.create({
            component: ImageModalPage,
            componentProps: {
                img
            },
            cssClass: 'transparent-modal'
        });

        modal.present();

    }

    chooseImage() {
       
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        };
        this.camera.getPicture(options).then((imageData) => {

            this.fileChangeEvent('data:image/jpeg;base64,' + imageData);
        }, (err) => {
            // Handle error
            
            //alert(JSON.stringify(err))
        });
        
    }

    async fileChangeEvent(event: any) {

        this.currentMessage.type = 'image';

        this.scrollToBottom(500,true)

        let src = event;
             // create a random id
        const randomId = Math.random().toString(36).substring(2);
        // create a reference to the storage bucket location
        let ref = this.afStorage.ref('/messenger/' + randomId);
        // the put method creates an AngularFireUploadTask
        // and kicks off the upload
        const base64result = (<string>src).split(',')[1];
        // console.log(base64result);
        let task = ref.putString(base64result, 'base64', {
            contentType: 'image/jpeg'
        });

        // AngularFireUploadTask provides observable
        // to get uploadProgress value
        let uploadProgress;
        uploadProgress = task.snapshotChanges()
            .pipe(map(s => (s.bytesTransferred / s.totalBytes) * 100));

        // observe upload progress
        uploadProgress = task.percentageChanges().subscribe(percentage => {
            //@ts-ignore
            this.uploadPercentage = percentage === 100 ? 1 :  "0." + parseInt((Math.round(percentage * 100) / 100));
        });
        // get notified when the download URL is available

        task.snapshotChanges().subscribe(res=>{
            if(res.state === 'success') {
                setTimeout(_=> {
                    console.log('Fire');
                    //this.currentMessage.base64 = this.getImageSrc(randomId, 'small');
                    this.currentMessage.content = randomId;
                    this.uploadPercentage = 0;
                    this.sendMessage();
                },600);
            }
        });
        
    }

    getImageSrc(src,size) {

        var obj = new Object();

        obj['large'] = '600x600';
        obj['small'] = '120x120';
        
        return 'https://firebasestorage.googleapis.com/v0/b/polymatch-d1996.appspot.com/o/messenger%2F'+src+'_'+obj[size]+'?alt=media&token=e8592218-4dff-486e-99c8-051ce92901f3';
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
                         title: 'Polymory', 
                         body: 'בקשת התמונה נדחתה ❌', 
                         page: '/tabs/matches', 
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
                         title: 'Polymory', 
                         body: 'בקשת התמונה התקבלה ✅', 
                         page: '/tabs/matches',
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

        const source = this.chatService.get(this.chatId)

        this.chat$ = this.chatService.joinUsers(source);

        this.subscription = this.chat$.pipe().subscribe(chat => {

            this.currentMessage.type = '';
            this.updatedDialogue = true;

            if (chat.messages.length > 0) {
                this.imageRequestMessage = chat.messages.filter(msg => msg.imageRequest && !msg.delivered && this.userService.user.id !== msg.uid);

                if(this.imageRequestMessage.length !== 0) {
                    this.imageRequestMessage = [];
                    this.imageConfirmation();
                }

                let unreadMessagesCount = chat.messages.filter(msg => !msg.delivered && this.userService.user.id !== msg.uid).length;
                this.chatService.setMessagesAsReceived(chat, this.userService.user, this.chatId);
                this.counterService.setByUserId(this.userService.user.id, - unreadMessagesCount, 'newMessages');

                chat.messages.map((message, i) => {
                    message.time = DateHelper.getCurrentTime(message.createdAt);
                    const date = DateHelper.formatMovementDate(message.createdAt, 'he-IL');
                    message.date = date;
                    message.chatDate = message.date;

                    message.date =  i === 0 || (i > 0 && (message.date !== chat.messages[i - 1].chatDate)) ? date : '';

                    if(message.date && message.date !='היום') { 
                        message.date = message.date.split(".");
                        message.date = DateHelper.addZero(message.date[0]) + '.' + DateHelper.addZero(message.date[1]) + '.' + message.date[2]
                    }

                    return message;
                });

            }
            this.scrollToBottom(500, true);
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
    }

    ionViewWillEnter() {

        this.userService.getById(this.interlocutorId).subscribe(user => {
            this.generalService.currentPage.next("chat");
            this.generalService.activeInboxTab.next(this.interlocutorId);
            this.chatService.interlocutor = user;

            this.getListData('blockList', this.chatService.interlocutor.id).subscribe((res: any) => {
                if (!res.empty) {
                    this.blockedMessage = 'המשתמש הוסיף אותך לרשימה השחורה';
                } else {
                    if (this.dialogueExists && this.userService.isPremium()) {
                        this.getDialogue();
                    }
                }
            });
        });
    }

    validateMessage() {
        if (this.currentMessage.content.length > 300) {
            this.currentMessage.content = this.currentMessage.content.substring(0, this.currentMessage.content.length - 1);
            this.errMessage = 'הודעה אחת צריכה להכיל לא יותר מ-300 תווים. ההודעה הנוכחית כוללת ' + this.currentMessage.content.length + ' תווים';
            this.presentToast(this.errMessage);
            return;
        }
    }

    async viewSubscriptionGold() {
        const modal = await this.modalCtrl.create({
            component: TinderGoldPage,
            cssClass: 'custom-modal-small',
        });
        modal.onWillDismiss().then((res:any) => {
            this.userService.setPayed(res.data.payed);
            if(res.data.payed){
                this.getDialogue()
            }
        })

        return await modal.present();
    }

    sendMessage() {
        
        if (!this.currentMessage.content) {
            return;
        }

        this.updatedDialogue = false;
        this.temporaryMessage = this.currentMessage.content;
        this.currentMessage.content = '';
        setTimeout(() => {
            this.scrollToBottom();
        });

        this.chatService.sendMessage(this.chatId, this.temporaryMessage, this.userService.user.id, false, this.currentMessage.type).then(_ => {
            if (!this.dialogueExists) {
                this.chatService.setDialogue(this.chatId).subscribe(res => {
                    this.getDialogue();
                });
            }

            const pushData = {title: 'Polymory', body: 'קיבלת הודעה חדשה', page: '/tabs/matches', modal: false, sender: this.userService.user, receiver: this.chatService.interlocutor};

            // Sending push only to active users
            if (this.chatService.interlocutor.status === 1) {
                this.fcmService.sendPushMessage(pushData);
            }

            // Set counter for unread messages
            this.counterService.setByUserId(this.chatService.interlocutor.id, 1, 'newMessages');

             setTimeout(() => {
                 this.scrollToBottom();
             }, 300);


            //this.currentMessage.content = '';
        });
        
    }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 3000
        });
        toast.present();
    }

    trackByCreated(i, msg) {
        return msg.createdAt;
    }

    scrollToBottom(duration = 0, isFirstLoad = false) {
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

    lazyLoadCallback(event: StateChange, src = '',index) {
        switch (event.reason) {
            case 'setup':
              // The lib has been instantiated but we have not done anything yet.
              break;
            case 'observer-emit':
              // The image observer (intersection/scroll/custom observer) has emit a value so we
              // should check if the image is in the viewport.
              // `event.data` is the event in this case.
              break;
            case 'start-loading':
              // The image is in the viewport so the image will start loading
              break;
            case 'mount-image':
              // The image has been loaded successfully so lets put it into the DOM
              break;
            case 'loading-succeeded':
                this.scrollToBottom(500,true);
              // The image has successfully been loaded and placed into the DOM
              break;
            case 'loading-failed':
                console.log(event);
                this.imagesError[index] = src;

              // The image could not be loaded for some reason.
              // `event.data` is the error in this case
              break;
            case 'finally':
              // The last event before cleaning up
              break;
          }
    }

    nl2br(text: string) {
        if (!text) return text;
        return text.replace(/\n/gi, '<br>');
    }
}

