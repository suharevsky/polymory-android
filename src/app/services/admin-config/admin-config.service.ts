import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TableService} from '../../crud-table';
import {environment} from '../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminConfigService extends TableService<any> {
  API_URL = `${environment.apiUrl}/adminSettings`;
  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  getOnlineDuration(): Observable<any> {
    return this.http.get<any>(this.API_URL).pipe(
        map((response: any) => {
          response = {id: response[0].id, ...response[0].settings};
          return response;
        })
    );
  }

}
