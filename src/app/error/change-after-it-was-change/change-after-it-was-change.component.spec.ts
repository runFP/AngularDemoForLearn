import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeAfterItWasChangeComponent } from './change-after-it-was-change.component';

describe('ChangeAfterItWasChangeComponent', () => {
  let component: ChangeAfterItWasChangeComponent;
  let fixture: ComponentFixture<ChangeAfterItWasChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeAfterItWasChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeAfterItWasChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
