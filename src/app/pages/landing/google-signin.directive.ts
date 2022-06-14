import {Directive, HostListener} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';

import {UserService} from '../../services/user/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {isPlatform, LoadingController, Platform} from '@ionic/angular';
// import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Directive({
    selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
    public loading;

    constructor(private afAuth: AngularFireAuth, private navCtrl: Router, private loadingCtrl: LoadingController,
                public userService: UserService, private authService: AuthService, public platform: Platform) {
       
        this.platform.ready().then(() => {
            GoogleAuth.initialize({
                clientId: '793648489294-e0sbpo0le6bsejj61l2npjrs7ul7ql5c.apps.googleusercontent.com',
                scopes: ['profile', 'email'],
            });          
        })
    }

    async refresh() {
       const authCode = GoogleAuth.refresh();
       console.log('authCode: ', authCode)
    }

    async signOut() {
        GoogleAuth.signOut();
     }

    async presentLoading(message: string = '') {
        this.loading = await this.loadingCtrl.create({
            message,
            translucent: true,
        });

        await this.loading.present();
    }

    @HostListener('click')
    async onclick() {

    GoogleAuth.signIn().then((res:any) => {
            this.userService.getById(res.idToken).subscribe(user => {
                console.log(res);

                if (user) {
                    this.userService.setUser(user);
                    this.authService.login(user);
                    this.navCtrl.navigate(['tabs/highlights']);
                } else {
                    this.authService.tab = 'registration';
                    this.userService.setUser({socialAuthId: res.authentication.accessToken,username: res.givenName, email: res.email, sexualOrientation: []});
                    // this.userService.getSocialAuthId();
                    // this.afAuth.signOut().then(_ => {
                    this.navCtrl.navigate(['register-steps']);
                    // })
                }
            },err => alert(JSON.stringify(err)));
        }).catch(err => alert(JSON.stringify(err))).finally(() => {
            //this.loading.dismiss();
        });
    }

}
