import {Component, NgZone, ViewChild} from '@angular/core';
import {IonRouterOutlet, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {ThemeService} from './services/theme/theme.service';
import {RouterService} from './services/router.service';
import {UserService} from './services/user/user.service';
import { UpdateAppService } from './services/update-app/update-app.service';
import { Router } from '@angular/router';
import { GeneralService } from './services/general/general.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    @ViewChild(IonRouterOutlet, {static: false}) routerOutlet: IonRouterOutlet;
    public networkStatus: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private themeService: ThemeService,
        private routerService: RouterService,
        public userService: UserService,
        public updateAppService: UpdateAppService,
        public generalService: GeneralService,
        private router: Router
       // private ngZone: NgZone,
    ) {
        this.initializeApp();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit(): void {
        this.routerService.init(this.routerOutlet);
    }

    async initializeApp() {
       // this.userService.setUser(user);
       // alert(this.userService.user.id);
        this.platform.ready().then(() => {
            if(!this.generalService.isDesktop()) {
                this.router.navigate(['/tabs/highlights']);
            }
            if(this.platform.is('android') || this.platform.is('ios')) {
                this.updateAppService.checkForUpdate();
            }
            this.statusBar.styleDefault();
            this.themeService.toggleDarkMode(true);
            this.splashScreen.hide();

            /*Network.addListener('networkStatusChange', (status) => {
                this.ngZone.run(() => {
                    // This code will run in Angular's execution context
                    this.networkStatus = status.connected ? 'Online' : 'Offline';
                    console.log(this.networkStatus);
                });
            });*/
        });
        // this.themeService.restore();
        this.themeService.toggleDarkMode(true);
    }
}
