import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
//import {RouterService} from '../../services/router.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import { ParamsService } from 'src/app/services/params/params.service';
import { ProfilePage } from '../profile/profile.page';

@Component({
    selector: 'app-matches',
    templateUrl: './matches.page.html',
    styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit, OnDestroy {
    public segmentView = '0';
    public messages;
    public user;
    private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

    constructor(private navCtrl: NavController,
                public modalCtrl: ModalController,
                //private routerService: RouterService,
                public paramsService: ParamsService,
                public userService: UserService) {
                    let params = this.paramsService.getAll();
                    if(params?.modal && params.sender) {
                        this.viewProfile(params.sender);
                        this.paramsService.reset();
                    }
        this.userService.getUser();
    }
    
    ngOnInit() {}

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

    ionViewDidEnter() {
        //this.routerService.toggleSwipeBack(false);
    }

    ionViewWillLeave() {
        //this.routerService.toggleSwipeBack(true);
    }

    goToLikes() {
        this.navCtrl.navigateBack('/likes');
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
        this.subscriptions.forEach((sb1) => sb1.unsubscribe());
    }
}
