import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import { NavController} from '@ionic/angular';
import {UserModel} from '../../models/user.model';
import {CounterService} from '../../services/counter/counter.service';
import {AuthService} from '../../services/auth/auth.service';
import {counterSubject} from '../../components/tabs/tabs.page';
import { GeneralService } from 'src/app/services/general/general.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.page.html',
    styleUrls: ['./likes.page.scss'],
})
export class LikesPage implements OnInit {

    public highlightView = 1;
    public favoriteList = [];
    public viewedList = [];
    public likeList = [];
    public counter;
    public isLoading = true;
    public user: UserModel;
    public slicedList;
    public type = 'views';
    public pageTitle = 'צפו בי';

    private subscriptions: Subscription[] = [];

    constructor(public authService: AuthService,
                public userService: UserService,
                public counterService: CounterService,
                public navCtrl: NavController,
                public generalService: GeneralService,
                public route: ActivatedRoute
    ) {
    }

    async ngOnInit() {}

    async ionViewWillEnter() {

        this.userService[this.type].lastKey = 0;    

        this.getList(this.type, true);

        await counterSubject.subscribe({
            next: (counter) => {
                this.counter = counter;
            }
        });
        this.generalService.currentPage.next(this.type);
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
        }else if (+this.highlightView === 2) {
            this.type = 'likes';
            if (this.likeList.length === 0) {
                this.getList('likes');
            }
        }
    }

    // Reload list when adding or removing 
    // profile to favorite
    reloadFavorites() {
        this.userService.favorites.lastKey = 0;    
        this.getList('favorites', true);
    }


    getList(type, init = false) {
        type = type ? type : this.type;

        const list = this.userService.getList(type,type === 'likes');

        this.userService.joinListIdsWithUsers(list,type === 'likes' ? 'myId' : 'profileId').subscribe(results => {
            this.isLoading = false;


            if (type === 'favorites') {
                
                if (init) {
                    return this.favoriteList = results;
                }
                results.forEach(user => {
                    return this.favoriteList.push(user);
                });
            } else if(type === 'views') {
                if (init) {
                    return this.viewedList = results;
                }
                results.forEach(user => {
                    return this.viewedList.push(user);
                });
            }else if(type === 'likes') {
                if (init) {
                    return this.likeList = results;
                }
                results.forEach(user => {
                    return this.likeList.push(user);
                });
            }
        });
    }


    loadData(event) {
        setTimeout(_ => {
            event.target.complete().then(res => {
                this.getList(this.type);
            });
        }, 500);
    }
}
