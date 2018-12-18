import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFroggerComponent } from './ngx-frogger.component';

describe('NgxFroggerComponent', () => {
  let component: NgxFroggerComponent;
  let fixture: ComponentFixture<NgxFroggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxFroggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxFroggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
