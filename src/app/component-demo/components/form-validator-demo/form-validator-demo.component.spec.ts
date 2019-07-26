import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValidatorDemoComponent } from './form-validator-demo.component';

describe('FormValidatorDemoComponent', () => {
  let component: FormValidatorDemoComponent;
  let fixture: ComponentFixture<FormValidatorDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormValidatorDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormValidatorDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
