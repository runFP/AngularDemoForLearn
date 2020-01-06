import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomSanitizerDemoComponent } from './dom-sanitizer-demo.component';

describe('DomSanitizerDemoComponent', () => {
  let component: DomSanitizerDemoComponent;
  let fixture: ComponentFixture<DomSanitizerDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomSanitizerDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomSanitizerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
