import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeHomeComponent } from './three-home.component';

describe('ThreeHomeComponent', () => {
  let component: ThreeHomeComponent;
  let fixture: ComponentFixture<ThreeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
