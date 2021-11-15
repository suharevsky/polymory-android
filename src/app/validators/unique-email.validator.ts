import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {catchError, delay, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UniqueEmailValidator {
    public API_URL = `${environment.apiUrl}/users`;

    constructor(public http: HttpClient) {
    }

    checkIfEmailExists(email: string): Observable<any> {
        const url = `${this.API_URL}/email/${email}`;
        return of().pipe(_ => this.http.get(url));
    }

    emailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.checkIfEmailExists(control.value).pipe(
                map(user => {
                    // if res is true, username exists, return true
                    return user ? {valueExists: true} : null;
                    // NB: Return null if there is no error
                })
            );
        };
    }
}
