import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Subscription} from 'rxjs';
import {IonContent, IonInfiniteScroll, ModalController, NavController, ToastController} from '@ionic/angular';
import {FilterPage} from '../filter/filter.page';
import {FcmService} from '../../services/fcm/fcm.service';
import {UserModel} from '../../models/user.model';
import {FilterService} from '../../services/filter/filter.service';
import {PhotosPage} from '../photos/photos.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { debounceTime, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-highlights',
    templateUrl: './highlights.page.html',
    styleUrls: ['./highlights.page.scss'],
})
export class HighlightsPage implements OnInit, OnDestroy {
    @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

    @ViewChild(IonContent, {static: false}) content: IonContent;

    isLoading = true;
    user: UserModel;
    // store last document
    users = [];
    bottomScrollBar = '800'
    warningMsg = {active: false, message: ''};
    ageRange: any = {
        lower: 18,
        upper: 75
    };
    filterData = {
        typeUsers: 'all',
        area: '',
        ageRange: {
            upper: 75,
            lower: 18
        }
    };
    scrollPosition = 0;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(
        public userService: UserService,
        private authService: AuthService,
        private modalCtrl: ModalController,
        public navCtrl: NavController,
        public fcmService: FcmService,
        public filterService: FilterService,
        public toastController: ToastController,
        public element: ElementRef,
        public renderer: Renderer2,
        public generalService: GeneralService,
    ) {
    }

    async ngOnInit() {
        this.filterData = this.filterService.get(this.filterData);
        //console.log(this.userService.highlights);    
        this.getResults();
        this.fcmService.initPush();    
    }

    async getResults() {
        this.scrollPosition = 0;

        this.userService.highlights = {
            lastKey: undefined,
            finishLoad: false,
            length: 0,
            restResults: [],
            reload: false
        };

        this.loadHighlights().pipe(debounceTime(900)).subscribe(users => {

            this.isLoading = false;
            users.forEach((user: any) => this.users.push(user));
            this.userService.setOnline();
        });
    }
 
    checkIfFrozenAcc() {
        if (this.userService.user.status === 4) {
            // activate
            this .userService.user.status = 1;
            this.userService.update(this.userService.user).subscribe();
        }
    }

    async getPhotos() {
        const modal = await this.modalCtrl.create({
            component: PhotosPage,
        });
        return await modal.present();
    }

    hasRejectedPhotos() {
        const rejectedPhotos = this.userService.user.photos.filter(photo => photo.status === 2);

        if (rejectedPhotos.length > 0) {
            this.warningMsg.active = true;
            this.warningMsg.message = `התמונה שלך לא אושרה <br/>
              <span class="text-underline">ראה את הפרטים</span>`;
        }
    }

    ionViewWillEnter() {
        this.generalService.currentPage.next('highlights');
        if(this.userService.highlights.reload) {
            // Refresh page becase user might choose difference prefference
            this.filter()
        }
        // Restore scroll position
        // this.content.scrollToPoint(0, this.scrollPosition);
        
        this.hasRejectedPhotos();
        this.checkIfFrozenAcc();
                  
        
        // this.renderer.setStyle(this.header.el, 'webkitTransition', 'top 700ms');
    }

    // in my case i'm using ionViewWillEnter
    /*onContentScroll(event) {
        if (event.detail.scrollTop >= 50) {
            this.renderer.setStyle(this.header.el, 'top', '-86px');
        } else {
            this.renderer.setStyle(this.header.el, 'top', '20px');
        }
    }*/


    async filterModal() {
        const modal = await this.modalCtrl.create({
            component: FilterPage,
            swipeToClose: true,
            cssClass: 'custom-filter-form',
        });

        modal.onDidDismiss()
            .then((res) => {
                if (res.data) {
                    if(this.generalService.isDesktop()) {
                        document.body.scrollTop = 0;
                        document.documentElement.scrollTop = 0
                        this.filterData = {...this.filterData, ...res.data};
                        this.filter();
                    }else{
                        this.content.scrollToTop().then(_ => {
                            this.filterData = {...this.filterData, ...res.data};
                            this.filter();
                        });
                    }
                }
            });
        return await modal.present();
    }

    async filter() {

        this.userService.highlights.lastKey = undefined;
        this.userService.highlights.finishLoad = false;
        this.userService.highlights.restResults = [];
        this.filterService.set(this.filterData);

        this.users = [];
        this.loadHighlights().subscribe(users => {
            users.forEach(user => this.users.push(user));
        });
    }

    ionViewDidLeave() {
        // Save scroll position
        // this.content.getScrollElement().then(data => {
        //     this.scrollPosition = data.scrollTop;
        // });
    }

    loadData(event) {
        setTimeout(_ => {
            event.target.complete().then(_ => {
                    this.loadHighlights().subscribe(users => {
                        users.forEach(user => this.users.push(user));
                        if(users.length === 0) {
                            this.userService.highlights.restResults.forEach(user => {
                                this.users.push(user);
                            });
                            this.users = [...new Map(this.users.map(item =>
                                [item['id'], item])).values()];
                        }
                    });
            });
        }, 500);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }

    public loadHighlights() {
        return this.userService.loadHighlights(this.filterData);
    }
}
