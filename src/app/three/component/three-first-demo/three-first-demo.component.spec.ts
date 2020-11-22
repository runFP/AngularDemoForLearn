import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeFirstDemoComponent } from './three-first-demo.component';

describe('ThreeFirstDemoComponent', () => {
  let component: ThreeFirstDemoComponent;
  let fixture: ComponentFixture<ThreeFirstDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeFirstDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeFirstDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
