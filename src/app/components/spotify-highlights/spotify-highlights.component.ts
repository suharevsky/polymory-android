import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'spotify-highlights',
  templateUrl: './spotify-highlights.component.html',
  styleUrls: ['./spotify-highlights.component.scss'],
})
export class SpotifyHighlightsComponent implements OnInit {
  activeIndex: number = 0;
  items: any[] = [0,1,2,3];
  @ViewChild('slides', {static: false}) slides: IonSlides;

  constructor() { }

  ngOnInit() {}

  onSlideChange() {
    this.slides.getActiveIndex()
      .then(index => {
        this.activeIndex = index;
      })
  }

}
