import { Component, Input, OnInit } from '@angular/core';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent implements OnInit {
  @Input() headline: string;
  @Input() buttonLabel: string;
  @Input() loading: boolean;

  constructor(
    public userService: UserService,
  ) { 
  }

  ngOnInit() {}

}
