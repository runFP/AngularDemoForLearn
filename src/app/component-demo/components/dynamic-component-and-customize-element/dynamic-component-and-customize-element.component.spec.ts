import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicComponentAndCustomizeElementComponent } from './dynamic-component-and-customize-element.component';

describe('DynamicComponentAndCustomizeElementComponent', () => {
  let component: DynamicComponentAndCustomizeElementComponent;
  let fixture: ComponentFixture<DynamicComponentAndCustomizeElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicComponentAndCustomizeElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicComponentAndCustomizeElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
