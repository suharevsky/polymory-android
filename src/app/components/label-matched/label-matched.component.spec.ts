import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LabelMatchedComponent } from './label-matched.component';

describe('LabelMatchedComponent', () => {
  let component: LabelMatchedComponent;
  let fixture: ComponentFixture<LabelMatchedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelMatchedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LabelMatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
