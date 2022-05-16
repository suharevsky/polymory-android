import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-push-alert',
  templateUrl: './push-alert.component.html',
  styleUrls: ['./push-alert.component.scss'],
})
export class PushAlertComponent implements OnInit {

  constructor(        
    private modalCtrl: ModalController,
    ) { 

    }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss(false)
  }

  accept() {
    this.modalCtrl.dismiss(true)
  }

}
