import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomAvatarPage } from './random-avatar.page';

describe('RandomAvatarPage', () => {
  let component: RandomAvatarPage;
  let fixture: ComponentFixture<RandomAvatarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RandomAvatarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomAvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
