import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'swipe-card',
  templateUrl: './swipe-card.component.html',
  styleUrls: ['./swipe-card.component.scss'],
})
export class SwipeCardComponent implements OnInit {
  @Input() data: any = {};
  @Input() isPreview: boolean = false;
  @Output() onNoMoreSlide = new EventEmitter();
  @Output() onViewInfo = new EventEmitter();

  profileImages: object[] = [];
  currentIndex: number = 0;

  constructor() { }

  ngOnInit() {
    this.profileImages = [
      { imageUrl: this.data.profile_image_url },
      { imageUrl: 'assets/img/people/thanos.png' },
      { imageUrl: 'assets/img/people/captain.png' },
      { imageUrl: 'assets/img/people/thor.png' },
    ]
  }

  handleNoMoreSlide(isOnTheLeft: boolean) {
    this.onNoMoreSlide.emit(isOnTheLeft);
  }

  handleViewInfo() {
    this.onViewInfo.emit();
  }

  handleSlideChange(index: number) {
    this.currentIndex = index;
  }

}
