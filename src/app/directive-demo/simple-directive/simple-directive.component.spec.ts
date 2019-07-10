import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDirectiveComponent } from './simple-directive.component';

describe('SimpleDirectiveComponent', () => {
  let component: SimpleDirectiveComponent;
  let fixture: ComponentFixture<SimpleDirectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDirectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
