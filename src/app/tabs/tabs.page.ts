import {UserModel} from '../models/user.model';
import {Component, OnInit} from '@angular/core';
import {CounterService} from '../services/counter/counter.service';
import {UserService} from '../services/user/user.service';
import {BehaviorSubject} from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const counterSubject = new BehaviorSubject(0); // 0 is the initial value

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})


export class TabsPage implements OnInit {

    counter: any;
    public user: UserModel;

    constructor(
        public userService: UserService,
        private authService: AuthService,
        public counterService: CounterService,
    ) {
        
    }

    ngOnInit(): void {
        this.userService.getUser();
            this.counterService.getByUserId(this.userService.user?.id).subscribe(result => {

                this.counter = result.payload.data();
                counterSubject.next(this.counter);
                counterSubject.subscribe();
                /*counterSubject.subscribe({
                    next: (v) => {
                    }
                });*/
            });
    }
}
