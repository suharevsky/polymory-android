import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const API_USERS_URL = `${environment.apiUrl}/page`;

@Injectable({
    providedIn: 'root',
})
export class PageService {
    constructor(private http: HttpClient) {
    }

    getByUrl(url): Observable<any> {
        return this.http.get<any>(`${API_USERS_URL}/${url}`);
    }
}
