import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParamsService {

  private data: any;

  constructor() { }

  public set(data) {
    this.data = data;
  }

  public getAll() {
    return this.data;
  }

  public getByProperty(prop) {
    return this.data[prop];
  }

  public reset() {
    this.data = {};
  }
}
