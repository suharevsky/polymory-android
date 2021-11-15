import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FilterService {

    public name = 'filter';

    constructor() {
    }

    public set(filter) {

      localStorage.setItem(this.name, JSON.stringify(filter));

      return filter;
    }

    public delete() {
        localStorage.removeItem(this.name);
    }

    get(filter) {
        if (localStorage.getItem(this.name)) {
            return JSON.parse(localStorage.getItem(this.name));
        }else{
            localStorage.setItem(this.name, JSON.stringify(filter));
            return filter;
        }
    }
}
