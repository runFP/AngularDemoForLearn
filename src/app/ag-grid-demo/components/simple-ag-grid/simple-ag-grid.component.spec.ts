import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAgGridComponent } from './simple-ag-grid.component';

describe('SimpleAgGridComponent', () => {
  let component: SimpleAgGridComponent;
  let fixture: ComponentFixture<SimpleAgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleAgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
