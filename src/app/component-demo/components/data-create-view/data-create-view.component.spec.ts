import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCreateViewComponent } from './data-create-view.component';

describe('DataCreateViewComponent', () => {
  let component: DataCreateViewComponent;
  let fixture: ComponentFixture<DataCreateViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataCreateViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCreateViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
