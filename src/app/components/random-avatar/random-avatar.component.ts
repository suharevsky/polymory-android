import { Component, OnInit, Input } from '@angular/core';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'random-avatar',
  templateUrl: './random-avatar.component.html',
  styleUrls: ['./random-avatar.component.scss'],
})
export class RandomAvatarComponent implements OnInit {
  @Input() size: string = '';// Can be xs/sm/md/lg/xl/xxl
  @Input() customSize: number = null;
  @Input() photo: string = null;
  @Input() user;

  images: any[] = [
    'assets/img/avatars/hieu.png',
  ];
  imageUrl: string;

  constructor(public userService: UserService) {
    let randomIndex = Math.floor(Math.random() * (this.images.length - 1));
    this.imageUrl = `${this.images[randomIndex]}`;
  }

  ngOnInit() {}

}
