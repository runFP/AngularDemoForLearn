import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDynamicModuleAndComponentComponent } from './create-dynamic-module-and-component.component';

describe('CreateDynamicModuleAndComponentComponent', () => {
  let component: CreateDynamicModuleAndComponentComponent;
  let fixture: ComponentFixture<CreateDynamicModuleAndComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDynamicModuleAndComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDynamicModuleAndComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
