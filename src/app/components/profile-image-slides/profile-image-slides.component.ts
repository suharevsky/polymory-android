import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {TapticEngine} from '@ionic-native/taptic-engine/ngx';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {UserModel} from '../../models/user.model';
import { ChatService } from 'src/app/services/chat/chat.service';
import { FcmService } from 'src/app/services/fcm/fcm.service';
import { CounterService } from 'src/app/services/counter/counter.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { ImageRequestService } from 'src/app/services/image-request/image-request.service';

@Component({
    selector: 'profile-image-slides',
    templateUrl: './profile-image-slides.component.html',
    styleUrls: ['./profile-image-slides.component.scss']
})
export class ProfileImageSlidesComponent implements OnInit {
    activeIndex: number = 0;
    setSlideHeight = 0;
    setSlideWidth = 0;
    currentEnd: number = -1;
    @Input() user: UserModel;
    @Input() images: any[] = [];
    @Input() isClickable: boolean = false;
    @Output() onNoMoreSlide = new EventEmitter();
    @Output() onChange = new EventEmitter();
    @ViewChild('profileImages', {static: false}) slides: IonSlides;
    @ViewChild('slideHeight') slideHeight: ElementRef;
    @ViewChild('sliderHeight') sliderHeight: ElementRef;

    constructor(
        private taptic: TapticEngine, 
        public authService: AuthService, 
        public userService: UserService, 
        public fcmService: FcmService, 
        public counterService: CounterService,
        public imageRequestService: ImageRequestService,
        public generalService: GeneralService,
        public chatService: ChatService) 
        {}

    ngOnInit() {

        if(this.user) {
            this.images = this.userService.getAllPhotos(this.user, true);
        }else{
            setTimeout(()=>{
                console.log(this.user);
                this.images = this.userService.getAllPhotos(this.user, true);
                //this.cd.detectChanges();
            },0);
        }

        //this.userService.getListData('requestImage',this.user.id).subscribe(res => this.imageRequest = res); 
        //this.imageRequestService.checkImageRequest(this.user);     
    }

    ngAfterViewInit() {
        setTimeout(_ => {
            //@ts-ignore
            this.setSlideHeight = this.generalService.isDesktop() ? this.slideHeight.el.offsetWidth + 'px' : 'auto';

        },1000);
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
        console.log('onReachStart')
        this.currentEnd = -1;
    }

    onReachEnd() {
        console.log('onReachEnd')
        this.currentEnd = 1;
    }
}