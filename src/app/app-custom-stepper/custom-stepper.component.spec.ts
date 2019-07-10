import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomStepperComponent } from './app-custom-stepper.component';

describe('AppCustomStepperComponent', () => {
  let component: AppCustomStepperComponent;
  let fixture: ComponentFixture<AppCustomStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCustomStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppCustomStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
