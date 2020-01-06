import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TlistDemoComponent } from './tlist-demo.component';

describe('TlistDemoComponent', () => {
  let component: TlistDemoComponent;
  let fixture: ComponentFixture<TlistDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlistDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlistDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
