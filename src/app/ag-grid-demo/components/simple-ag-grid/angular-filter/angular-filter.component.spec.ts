import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularFilterComponent } from './angular-filter.component';

describe('AngularFilterComponent', () => {
  let component: AngularFilterComponent;
  let fixture: ComponentFixture<AngularFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
