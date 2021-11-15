import { Component, OnInit, Input } from '@angular/core';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss'],
})
export class PersonCardComponent implements OnInit {
  @Input() data: any;

  constructor(
      public userService: UserService
  ) {     
  }

  ngOnInit() {
  }

}
