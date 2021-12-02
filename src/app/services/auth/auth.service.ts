import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, Observable, of, Subscription} from 'rxjs';
import {UserModel} from '../../models/user.model';
import {catchError, finalize, map} from 'rxjs/operators';
import {AuthHTTPService} from '../auth-http';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthModel} from '../../models/auth.model';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {
    // public fields
    isLoading$: Observable<boolean>;
    currentUserSubject: BehaviorSubject<UserModel>;
    isLoadingSubject: BehaviorSubject<boolean>;
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    private authLocalStorageToken;
    currentUser$: Observable<UserModel>;

    constructor(
        private authHttpService: AuthHTTPService,
        private userService: UserService,
        private fireAuth: AngularFireAuth,
        private router: Router,
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
        const subscr = this.getUserByToken().subscribe();
        this.unsubscribe.push(subscr);
    }

    loginPhone(phone: string, appVerifier: any) {
        return this.fireAuth.signInWithPhoneNumber(phone, appVerifier)
    }
    // need create new user then login
    registration(user: UserModel): Observable<any> {
        // this.isLoadingSubject.next(true);
        return this.authHttpService.createUser(user).pipe(
            map(() => {
                // this.isLoadingSubject.next(false);
            }),
            // switchMap(() => this.login(user.email, user.password)),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    logout() {
        this.fireAuth.signOut().then(_ => {
            localStorage.removeItem(this.authLocalStorageToken);
            this.router.navigate(['/landing']);
        });
    }

    login(auth) {
        this.setAuthFromLocalStorage(auth);
    }

    getUserByToken(): Observable<UserModel> {
        const auth = this.getAuthFromLocalStorage();
        if (!auth || !auth.accessToken) {
            return of(undefined);
        }

        console.log(auth);

        this.userService.setUser(auth);
        // this.isLoadingSubject.next(true);
        return this.authHttpService.getUserByToken(auth.accessToken).pipe(
            map((user: UserModel) => {
                if (user) {
                    this.currentUserSubject = new BehaviorSubject<UserModel>(user);
                } else {
                    this.logout();
                }
                return user;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    ngOnDestroy(): void {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    private setAuthFromLocalStorage(auth: AuthModel): boolean {
        // store auth accessToken/refreshToken/expiresIn in local storage to keep user logged in between page refreshes
        if (auth && auth.accessToken) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
            return true;
        }
        return false;
    }

    private getAuthFromLocalStorage(): AuthModel {
        try {
            return JSON.parse(
                localStorage.getItem(this.authLocalStorageToken)
            );
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }
}
