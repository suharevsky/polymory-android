import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageSlidesComponent } from './profile-image-slides.component';

describe('ProfileImageSlidesComponent', () => {
  let component: ProfileImageSlidesComponent;
  let fixture: ComponentFixture<ProfileImageSlidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageSlidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
