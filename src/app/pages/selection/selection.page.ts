import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
})
export class SelectionPage implements OnInit {
  tagList: any[] = [];

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.tagList = [
      {
        label: 'Travel',
        active: true,
      },
      {
        label: 'Instagram',
        active: true,
      },
      {
        label: 'Walking',
        active: false,
      },
      {
        label: 'Tea',
        active: false,
      },
      {
        label: 'Athlete',
        active: false,
      },
      {
        label: 'Yoga',
        active: false,
      },
      {
        label: 'Surfing',
        active: false,
      },
      {
        label: 'Volunteering',
        active: false,
      },
      {
        label: 'Picnicking',
        active: false,
      },
      {
        label: 'Trivia',
        active: false,
      },
      {
        label: 'Astrology',
        active: false,
      },
      {
        label: 'Writer',
        active: false,
      },
      {
        label: 'Grab a drink',
        active: false,
      },
      {
        label: 'Coffee',
        active: false,
      },
      {
        label: 'Baking',
        active: false,
      },
      {
        label: 'Gamer',
        active: false,
      },
      {
        label: 'Cycling',
        active: false,
      },
      {
        label: 'Museum',
        active: false,
      },
      {
        label: 'Brunch',
        active: false,
      },
      {
        label: 'Wine',
        active: false,
      },
      {
        label: 'Disney',
        active: false,
      },
      {
        label: 'Dancing',
        active: false,
      },
      {
        label: 'Climbing',
        active: false,
      },
      {
        label: 'Netflix',
        active: false,
      },
      {
        label: 'Outdoors',
        active: false,
      },
      {
        label: 'Board Games',
        active: false,
      },
      {
        label: 'Fishing',
        active: false,
      },
      {
        label: 'Dog lover',
        active: false,
      },
      {
        label: 'Karaoke',
        active: false,
      },
      {
        label: 'Art',
        active: false,
      },
      {
        label: 'Environmentalism',
        active: false,
      },
      {
        label: 'Fashion',
        active: false,
      },
      {
        label: 'Music',
        active: true,
      },
      {
        label: 'Shopping',
        active: false,
      },
      {
        label: 'DIY',
        active: false,
      },
      {
        label: 'Politics',
        active: false,
      },
      {
        label: 'Running',
        active: false,
      },
      {
        label: 'Spirituality',
        active: false,
      },
      {
        label: 'Soccer',
        active: false,
      },
      {
        label: 'Golf',
        active: false,
      },
      {
        label: 'Sports',
        active: false,
      },
      {
        label: 'Reading',
        active: false,
      },
      {
        label: 'Swimming',
        active: false,
      },
      {
        label: 'Language Exchange',
        active: false,
      },
      {
        label: 'Vlogging',
        active: false,
      },
      {
        label: 'Comedy',
        active: false,
      },
      {
        label: 'Movies',
        active: false,
      },
      {
        label: 'Craft Beer',
        active: false,
      },
      {
        label: 'Foodie',
        active: false,
      },
      {
        label: 'Blogging',
        active: false,
      },
      {
        label: 'Cat lover',
        active: false,
      },
      {
        label: 'Photography',
        active: false,
      },
      {
        label: 'Gardening',
        active: false,
      },
      {
        label: 'Cooking',
        active: true,
      },
      {
        label: 'Working out',
        active: true,
      },
      {
        label: 'Hiking',
        active: false,
      },
    ]
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

}
