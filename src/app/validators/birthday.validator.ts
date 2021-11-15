import {AbstractControl, ValidatorFn, ValidationErrors} from '@angular/forms';
import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BirthdayValidator {

    constructor() {
    }

    adultValidator(user) {

        return (control: AbstractControl): ValidationErrors | null => {
            console.log(user);
            console.log(control.value);
            const date = new Date(control.value).getTime(); // 1000;
            const age = ((new Date()).getTime() - date) / (1000 * 60 * 60 * 24 * 365);
            return of(((+age.toString().split('.')[0]) >= 18) ? null : {notAdult: true});
        };
    }
}
