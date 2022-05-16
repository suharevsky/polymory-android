import {Directive, HostListener} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {UserService} from '../../services/user/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {LoadingController} from '@ionic/angular';
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

@Directive({
    selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
    public loading;

    constructor(private afAuth: AngularFireAuth, private navCtrl: Router, private loadingCtrl: LoadingController,
                public userService: UserService, private authService: AuthService) {
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

        this.presentLoading();
        this.afAuth.signInWithPopup(new GoogleAuthProvider()).then(res => {
            this.userService.getById(res.user.id).subscribe(user => {
                if (user) {
                    this.userService.setUser(user);
                    this.authService.login(user);
                    this.navCtrl.navigate(['tabs/highlights']);
                } else {

                    this.userService.setUser({socialAuthId: res.user.id});
                    // this.userService.getSocialAuthId();
                    // this.afAuth.signOut().then(_ => {
                    this.navCtrl.navigate(['register-steps']);
                    // })
                }
            });
        }).catch(err => alert(JSON.stringify(err))).finally(() => {
            this.loading.dismiss();
        });
    }

}
