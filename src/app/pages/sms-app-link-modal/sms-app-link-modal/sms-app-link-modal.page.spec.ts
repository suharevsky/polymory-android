import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmsAppLinkModalPage } from './sms-app-link-modal.page';

describe('SmsAppLinkModalPage', () => {
  let component: SmsAppLinkModalPage;
  let fixture: ComponentFixture<SmsAppLinkModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsAppLinkModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SmsAppLinkModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
