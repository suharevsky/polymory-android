import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import SwiperCore, { SwiperOptions, Zoom } from 'swiper';
SwiperCore.use([Zoom])
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {

  @ViewChild('swiper') swiper: SwiperComponent;
  @Input()img: string;

  config: SwiperOptions = {
    zoom: true,
    centeredSlides: true,

  }

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }
}