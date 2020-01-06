import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnvarnishedTransmissionComponent } from './unvarnished-transmission.component';

describe('UnvarnishedTransmissionComponent', () => {
  let component: UnvarnishedTransmissionComponent;
  let fixture: ComponentFixture<UnvarnishedTransmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnvarnishedTransmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnvarnishedTransmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
