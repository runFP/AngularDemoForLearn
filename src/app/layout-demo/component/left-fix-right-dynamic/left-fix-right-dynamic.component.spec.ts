import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftFixRightDynamicComponent } from './left-fix-right-dynamic.component';

describe('LeftFixRightDynamicComponent', () => {
  let component: LeftFixRightDynamicComponent;
  let fixture: ComponentFixture<LeftFixRightDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftFixRightDynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftFixRightDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
