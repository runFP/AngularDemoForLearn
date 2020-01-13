import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickerColorComponent } from './picker-color.component';

describe('PickerColorComponent', () => {
  let component: PickerColorComponent;
  let fixture: ComponentFixture<PickerColorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickerColorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickerColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
