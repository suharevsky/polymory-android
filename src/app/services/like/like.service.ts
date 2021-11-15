import {Inject, Injectable, OnDestroy} from '@angular/core';
import {TableService} from '../../crud-table';
import {UserModel} from '../../models/user.model';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LikeService extends TableService<UserModel> implements OnDestroy {
    API_URL = `${environment.apiUrl}/likes`;
  protected http: HttpClient;

  constructor(@Inject(HttpClient) http) {
    super(http);
  }

  public received(userId) {
    return this.http.get<UserModel[]>(`${this.API_URL}/${userId}`);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
