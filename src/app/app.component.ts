import {Component, ViewChild} from '@angular/core';
import {IonRouterOutlet, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {ThemeService} from './services/theme/theme.service';
import {RouterService} from './services/router.service';
import {UserService} from './services/user/user.service';
import { UpdateAppService } from './services/update-app/update-app.service';
import { GeneralService } from './services/general/general.service';
import { PaymentService } from './services/payment/payment.service';


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
        public paymentService: PaymentService
       // private ngZone: NgZone,
    ) {
        this.initializeApp();
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngAfterViewInit(): void {
        this.routerService.init(this.routerOutlet);
    }

    async initializeApp() {
        this.platform.ready().then(() => {

          this.statusBar.styleDefault();
          this.themeService.toggleDarkMode(true);
          this.splashScreen.hide();
          this.paymentService.init();
            /*Network.addListener('networkStatusChange', (status) => {
              this.ngZone.run(() => {
                  // This code will run in Angular's execution context
                  this.networkStatus = status.connected ? 'Online' : 'Offline';
                  console.log(this.networkStatus);
              });
          });*/
        });
        // this.themeService.restore();
    }
}
