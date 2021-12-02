import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/general`;

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) {
  }

  sendAppLink(phoneNumber:string) {
    return this.http.post(`${API_URL}/sendAppLink`, {phoneNumber});
  }
}
