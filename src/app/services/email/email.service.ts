import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  API_URL = `${environment.apiUrl}/mail`;

  constructor(
    private http: HttpClient
  ) { }

  sendContactMessage(body) {
    return this.http.post(this.API_URL + `/contact/send`, body);
  }
}
