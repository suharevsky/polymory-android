import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TinderGoldPage } from './tinder-gold.page';

describe('TinderGoldPage', () => {
  let component: TinderGoldPage;
  let fixture: ComponentFixture<TinderGoldPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinderGoldPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TinderGoldPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
