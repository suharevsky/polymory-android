import { Component, Input, OnInit } from '@angular/core';
import { FilterService } from 'src/app/services/filter/filter.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input()filterData: any;
  public filterOptions = {
    active: false
  };
  constructor(
    public userService: UserService,
    public filterService: FilterService,
  ) { }

  ngOnInit() {
  }
  
}
