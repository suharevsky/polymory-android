import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general/general.service';

@Component({
  selector: 'app-sms-app-link-modal',
  templateUrl: './sms-app-link-modal.page.html',
  styleUrls: ['./sms-app-link-modal.page.scss'],
})
export class SmsAppLinkModalPage implements OnInit {
  @ViewChild('focusable') focusable;

  phoneNumber: string;
  response = {status: '', message: ''}
  constructor(public modalCtrl: ModalController, public generalService: GeneralService) { }

  ngOnInit() {
    /*
    setTimeout(_=> {
      console.log(document.getElementsByTagName('ion-input')[0]);
      if (document.getElementsByTagName('ion-input')[0]) {
        console.log('test');
        this.focusable.setFocus();
      }
    },0);*/
  }

  send() {
    this.response = {status: '', message: ''}
    
    if(this.phoneNumber && this.phoneNumber.length === 10) {
      let phoneNumber = '972' + this.phoneNumber;

      this.generalService.sendAppLink(phoneNumber).subscribe(_ => {
        this.response.status = 'success';
        this.response.message = 'הקישור נשלח בהצלחה!';
        setTimeout(()=>{
          this.close();
        },3000);

      });
    }else{
      this.response.status = 'error';
      this.response.message = 'מספר טלפון לא תקין';
    } 
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
