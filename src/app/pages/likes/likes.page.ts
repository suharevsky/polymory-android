import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {ModalController, NavController} from '@ionic/angular';
import {UserModel} from '../../models/user.model';
import {CounterService} from '../../services/counter/counter.service';
import {AuthService} from '../../services/auth/auth.service';
import {counterSubject} from '../../components/tabs/tabs.page';
import {ArrayHelper} from '../../helpers/array.helper';
import {ProfilePage} from '../profile/profile.page';
import { GeneralService } from 'src/app/services/general/general.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.page.html',
    styleUrls: ['./likes.page.scss'],
})
export class LikesPage implements OnInit, OnDestroy {

    public highlightView = 1;
    public favoriteList = [];
    public viewedList = [];
    public counter;
    public isLoading = true;
    public user: UserModel;
    public slicedList;
    public type = 'views';
    public pageTitle = 'צפו בי';

    private subscriptions: Subscription[] = [];

    constructor(public authService: AuthService,
                public userService: UserService,
                private modalCtrl: ModalController,
                public counterService: CounterService,
                public navCtrl: NavController,
                public generalService: GeneralService,
                public route: ActivatedRoute
    ) {
    }

    async ngOnInit() {
        
        //this.type = 'views';

        const tab =  window.location.pathname.split('/')[3] || '';

        console.log(tab)

        if(tab === 'favorites') {
            this.type = tab;
            this.pageTitle = 'מועדפים';
            this.highlightView = 0;
        }

        this.userService[this.type].lastKey = 0;
        this.getList(this.type, true);

        this.userService.getUser();
        this.isLoading = false;

       //this.route.url.subscribe(res => console.log(res))

        await counterSubject.subscribe({
            next: (counter) => {
                this.counter = counter;
            }
        });
    }

    getHighlightView() {
        this.userService[this.type].finishLoad = false;

        if (+this.highlightView === 0) {
            this.type = 'favorites';
            if (this.favoriteList.length === 0) {
                this.getList('favorites');
            }

            if (this.counter?.views > 0) {
                this.counterService.setByUserId(this.userService.user.id, 0, this.type);
            }
        }
    }

    getList(type, init = false) {
        type = type ? type : this.type;

        const list = this.userService.getList(type);

        this.userService.joinListIdsWithUsers(list).subscribe(results => {

            if (type === 'favorites') {
                if (init) {
                    return this.favoriteList = results;
                }
                results.forEach(user => {
                    return this.favoriteList.push(user);
                });
            } else {
                if (init) {
                    return this.viewedList = results;
                }
                results.forEach(user => {
                    return this.viewedList.push(user);
                });
            }
        });
    }

    async viewProfile(profile) {
        // this.navCtrl.navigateForward(`/profile/${user.id}`, user);
        const modal = await this.modalCtrl.create({
            component: ProfilePage,
            componentProps: {
                profile,
            }
        });

        modal.onDidDismiss()
            .then((res) => {
                if (res.data.reloadPrevPage) {
                    this.userService[this.type].lastKey = 0;
                    this.getList(this.type, true);
                }
            });
        return await modal.present();
    }

    ionViewWillEnter() {
      
    }

    loadData(event) {
        setTimeout(_ => {
            event.target.complete().then(res => {
                this.getList(this.type);
            });
        }, 500);
    }

    ngOnDestroy(): void {
    }
}
