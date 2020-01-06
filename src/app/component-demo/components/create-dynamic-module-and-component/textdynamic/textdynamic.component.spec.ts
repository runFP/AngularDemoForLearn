import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextdynamicComponent } from './textdynamic.component';

describe('TextdynamicComponent', () => {
  let component: TextdynamicComponent;
  let fixture: ComponentFixture<TextdynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextdynamicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextdynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
