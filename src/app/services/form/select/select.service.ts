import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SelectService {
  private value;

  public multiple = false;

  constructor() {}

  setMultiple(type: boolean = true) {
    this.multiple = type;
    return this;
  }

  getValue(): number {
    return this.value;
  }

  setValue(val: any) {
    this.value = val;
  }

  getGender(e, genderClass: string) {
    const elGender = e.target.closest('.smile-item');

    if (genderClass === 'gender') {
      document
        .querySelector(`.${genderClass}`)
        .querySelectorAll('.smile-item')
        .forEach((el) => {
          el.classList.remove('active');
        });

      elGender.classList.add('active');

      return elGender.dataset.gender;
    } else {
      const gendersArr = [];
      elGender.classList.toggle('active');
      document
        .querySelector(`.${genderClass}`)
        .querySelectorAll('.smile-item.active')
        .forEach((el) => {
          if (el instanceof HTMLElement) {
            gendersArr.push(el.dataset.gender);
          }
        });

      return gendersArr;
    }
  }
}
