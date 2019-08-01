import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CDKStepperDemoComponent } from './cdkstepper-demo.component';

describe('CDKStepperDemoComponent', () => {
  let component: CDKStepperDemoComponent;
  let fixture: ComponentFixture<CDKStepperDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CDKStepperDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CDKStepperDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
