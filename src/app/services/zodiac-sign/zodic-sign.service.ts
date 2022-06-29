import { Injectable } from '@angular/core';
import {zodiac} from './locales/zodiac';
import {elements} from './locales/elements';
import {zodiacKeys} from './zodiacKeys';


@Injectable({
  providedIn: 'root'
})
export class ZodicSignService {

  constructor() {}

  getDate(time) {
    const [day, month ] = time.split("-");
    return { day, month }
  }
 
  public getSignByDate(time) {

    const { day, month } = this.getDate(time);

    const date = new Date(`2000-${month}-${day}`);

    if (date.toString() === "Invalid Date") {return -1;}
  
    const signsData = Object.values(zodiacKeys);
    let signsLocale;
    
    signsLocale = Object.values(zodiac);
 
    let dateMin;
    let dateMax;
    const i = signsData.findIndex((sign: any) => {
      dateMin = new Date(sign.dateMin);
      dateMax = new Date(sign.dateMax);
  
      return (
        (date.getDate() >= dateMin.getDate() &&
          date.getMonth() == dateMin.getMonth()) ||
        (date.getDate() <= dateMax.getDate() &&
          date.getMonth() === dateMax.getMonth())
      );
    });
  
    let sign = Object.assign(signsLocale[i], signsData[i]);
    sign = this.getElement(sign);
  
    return sign.name;
  };

  public getElement(sign){

    sign.element = elements[sign.element];
  
    return sign;
  };
}
