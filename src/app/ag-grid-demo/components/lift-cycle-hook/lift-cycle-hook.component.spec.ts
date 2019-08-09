import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiftCycleHookComponent } from './lift-cycle-hook.component';

describe('LiftCycleHookComponent', () => {
  let component: LiftCycleHookComponent;
  let fixture: ComponentFixture<LiftCycleHookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiftCycleHookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiftCycleHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
