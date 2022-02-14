import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {

  constructor() { }

  public menu = [{
    title: 'מועדפים',
    route: 'user/likes',
    params: ''
  },
  {
    title: 'בי',
    route: 'user/likes',
    params: ''
  },
  {
    title: 'הפרופיל שלי',
    route: 'user/profile',
    params: ''
  },{
    title: 'גילוי',
    route: 'user/highlights',
    params: ''
  }
]
  

  ngOnInit() {}

}
