import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { EmailService } from 'src/app/services/email/email.service';
import { GeneralService } from 'src/app/services/general/general.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  public nodeMailerForm: FormGroup;
  public errors = [];
  public data;

  constructor(
    public generalService: GeneralService,
    private formBuildder: FormBuilder,
    private emailService: EmailService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
  ) {

   }

  ngOnInit() {
    this.nodeMailerForm = this.formBuildder.group({
      email: [this.userService.user?.email,[Validators.required, Validators.email]],
      subject: [null,[Validators.required]],
      text: [null,[Validators.required]],
    })
  }

  get f() {
    return this.nodeMailerForm.controls;
  }

  close() {
    this.navCtrl.navigateRoot('/');    
    this.done();
  }

  done() {
    this.modalCtrl.dismiss()
  }

  sendMail() {
    this.errors = [];

    Object.keys(this.f).map(field => {
  
      if(this.f[field].errors?.required) {
        this.errors.push(field);
      }

    })


    if(this.nodeMailerForm.status === "VALID") {

      let email = this.nodeMailerForm.value.email;
      let subject = this.nodeMailerForm.value.subject;
      let text = this.nodeMailerForm.value.text;
  
      let reqObj = {
        email, 
        subject, 
        text
      }
  
      this.emailService.sendContactMessage(reqObj).subscribe((data:any) => {
        this.data = data;
        if(this.data.status === 'success') {
          this.errors = [];
          Object.keys(this.f).map(field => {
              this.f[field].setValue('');
          })
        }
      })
    }
  }

}
