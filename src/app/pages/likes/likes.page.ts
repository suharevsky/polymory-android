import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {ModalController, NavController} from '@ionic/angular';
import {UserModel} from '../../models/user.model';
import {CounterService} from '../../services/counter/counter.service';
import {AuthService} from '../../services/auth/auth.service';
import {counterSubject} from '../../tabs/tabs.page';
import {ProfilePage} from '../profile/profile.page';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.page.html',
    styleUrls: ['./likes.page.scss'],
})
export class LikesPage implements OnInit, OnDestroy {

    public highlightView = 0;
    public favoriteList = [];
    public viewedList = [];
    public counter;
    public isLoading = true;
    public user: UserModel;
    public slicedList;
    public type = 'favorites';


    private subscriptions: Subscription[] = [];

    constructor(public authService: AuthService,
                public userService: UserService,
                private modalCtrl: ModalController,
                public counterService: CounterService,
                public navCtrl: NavController,
    ) {
    }

    async ngOnInit() {
        this.userService.getUser();
        this.isLoading = false;

        await counterSubject.subscribe({
            next: (counter) => {
                this.counter = counter;
            }
        });
    }

    getHighlightView() {
        this.userService[this.type].finishLoad = false;
        this.type = 'favorites';

        if (+this.highlightView === 1) {
            this.type = 'views';
            if (this.viewedList.length === 0) {
                this.getList('views');
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
                /*
                results.forEach(user => {
                    const uniqueUsr = this.viewedList.length > 0 ?
                        this.viewedList.filter(viewedUser => viewedUser.id !== user.id)[0] : user;
                    if (uniqueUsr) {
                        return this.viewedList.push(uniqueUsr);
                    }
                });*/
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
        this.userService[this.type].lastKey = 0;
        this.getList(this.type, true);
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
