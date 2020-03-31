import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAddRouteToLazyModuleComponent } from './dynamic-add-route-to-lazy-module.component';

describe('DynamicAddRouteToLazyModuleComponent', () => {
  let component: DynamicAddRouteToLazyModuleComponent;
  let fixture: ComponentFixture<DynamicAddRouteToLazyModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicAddRouteToLazyModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicAddRouteToLazyModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
