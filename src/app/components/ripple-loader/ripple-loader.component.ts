import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ripple-loader',
  templateUrl: './ripple-loader.component.html',
  styleUrls: ['./ripple-loader.component.scss']
})
export class RippleLoaderComponent implements OnInit {
  @Input() imageUrl: string = 'assets/img/logo_avatar.png';

  constructor() { }

  ngOnInit() {
  }

}
