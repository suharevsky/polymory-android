import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'ripple-loader',
  templateUrl: './ripple-loader.component.html',
  styleUrls: ['./ripple-loader.component.scss']
})
export class RippleLoaderComponent implements OnInit {
  @Input() imageUrl: string;

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

}
