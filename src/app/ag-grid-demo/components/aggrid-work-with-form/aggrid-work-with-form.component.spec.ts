import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggridWorkWithFormComponent } from './aggrid-work-with-form.component';

describe('AggridWorkWithFormComponent', () => {
  let component: AggridWorkWithFormComponent;
  let fixture: ComponentFixture<AggridWorkWithFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggridWorkWithFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggridWorkWithFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
