import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FilterService } from 'src/app/services/filter/filter.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input()filterData: any;
  public filterForm: FormGroup;
  public filterOptions = {
    active: false
  };
  constructor(
    public userService: UserService,
    public filterService: FilterService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    this.filterForm = this.fb.group({
      ageRange: [this.filterData.ageRange],
      withPhoto: [this.filterData.withPhoto],
      preferences: [this.filterData.preferences],
      area: [this.filterData.area],
      online: [this.filterData.online],
  });
  }

  onCheckBox(e) {
    console.log(e.target.dataset.id);
    if(e.target.dataset.id === 'withPhoto' && this.f.withPhoto.value) {
      this.f.online.setValue(false);
  }else if(e.target.dataset.id === 'online' && this.f.online.value){
      this.f.withPhoto.setValue(false);
  }else if(e.target.dataset.id === 'online' && !this.f.online.value){
      this.f.withPhoto.setValue(true);
  }else if(e.target.dataset.id === 'withPhoto' && !this.f.withPhoto.value) {
      this.f.online.setValue(true);
  }
}

get f() {
  return this.filterForm.controls;
}

reset() {
  Object.keys(this.f).forEach(key => {
      this.f[key].setValue('');
      console.log(key);
  });

  //this.f.ageRange.setValue(this.ageRange);
  this.f.preferences.setValue([]);
  this.f.online.setValue(false);
  this.f.withPhoto.setValue(true);
  this.filterData.area = '';

  this.filterService.delete();

  // this.preferences = this.preferences.map((el) => {
  //     el.chosen = false;
  //     return el
  // });
}

  submit() {
    this.filterOptions.active = false;

    Object.keys(this.f).forEach(key => {
      this.filterData[key] = this.f[key].value;
    });

    this.filterService.set(this.filterData);

    this.router.navigate(['/user/highlights']);

}

}
