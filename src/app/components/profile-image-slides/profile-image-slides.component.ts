import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {TapticEngine} from '@ionic-native/taptic-engine/ngx';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {UserModel} from '../../models/user.model';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { CounterService } from 'src/app/services/counter/counter.service';

@Component({
    selector: 'profile-image-slides',
    templateUrl: './profile-image-slides.component.html',
    styleUrls: ['./profile-image-slides.component.scss']
})
export class ProfileImageSlidesComponent implements OnInit {
    activeIndex: number = 0;
    currentEnd: number = -1;
    @Input() user: UserModel;
    @Input() images: any[] = [];
    @Input() isClickable: boolean = false;
    @Output() onNoMoreSlide = new EventEmitter();
    @Output() onChange = new EventEmitter();
    @ViewChild('profileImages', {static: false}) slides: IonSlides;
    imageRequest = {result: {accepted: false}, empty: true}; 

    constructor(
        private taptic: TapticEngine, 
        public authService: AuthService, 
        public userService: UserService, 
        public fcmService: FcmService, 
        public counterService: CounterService,
        //public cd: ChangeDetectorRef,
        public chatService: ChatService) 
        {}

    ngOnInit() {
        //setTimeout(()=>{
            this.images = this.userService.getAllPhotos(this.user, true);
            console.log(this.images);
            //this.cd.detectChanges();
        //});

        this.userService.getListData('requestImage',this.user.id).subscribe(res => this.imageRequest = res); 
        this.checkImageRequest();     
    }

    sendImageRequest(){
        this.imageRequest.empty = false;
        this.userService.setList('requestImage', this.user.id, this.userService.user.id).subscribe(res => {
            this.chatService.interlocutor = this.user;
            this.chatService.getDialogue().subscribe(async (res: any) => {
                this.chatService.sendMessage(res.chat.id, 'בקשה לאישור תמונה', this.userService.user.id, true).then(res => {
                    // Set counter for unread messages
                    this.counterService.setByUserId(this.chatService.interlocutor.id, +1, 'newMessages');
                    const pushData = {title: 'JoyMe', body: 'קיבלת בקשה לאישור תמונות', page: 'tabs/matches', receiver: this.chatService.interlocutor};
                    // Sending push only to active users
                    if (this.chatService.interlocutor.status === 1) {
                        this.fcmService.sendPushMessage(pushData);
                    }
                });
            });
        });
    }

    checkImageRequest() {
        this.userService.getListData('requestImage', this.user.id).subscribe(res =>{
            this.imageRequest.result = res.result[0];
            this.imageRequest.empty = res.empty;
        });
    }

    onSlideChange() {
        this.slides.getActiveIndex()
            .then(index => {
                this.activeIndex = index;
                this.onChange.emit(index);
            })
    }

    moveSlide(step: number = 1) {
        if (step === -1) {
            this.slides.slidePrev();
        } else if (step === 1) {
            this.slides.slideNext();
        }

        if (step === this.currentEnd) {
            // Could not go next or prev
            this.onNoMore(this.currentEnd === -1);
        } else {
            this.currentEnd = 0;
            this.taptic.selection();
        }
    }

    onNoMore(isOnTheLeft: boolean) {
        this.onNoMoreSlide.emit(isOnTheLeft);
        this.taptic.notification({type: 'warning'});
    }

    onReachStart() {
        this.currentEnd = -1;
    }

    onReachEnd() {
        this.currentEnd = 1;
    }
}