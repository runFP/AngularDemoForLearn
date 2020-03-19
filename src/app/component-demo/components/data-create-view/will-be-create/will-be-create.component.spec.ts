import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WillBeCreateComponent } from './will-be-create.component';

describe('WillBeCreateComponent', () => {
  let component: WillBeCreateComponent;
  let fixture: ComponentFixture<WillBeCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WillBeCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WillBeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
