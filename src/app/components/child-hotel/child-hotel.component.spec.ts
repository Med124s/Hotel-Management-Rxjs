import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildHotelComponent } from './child-hotel.component';

describe('ChildHotelComponent', () => {
  let component: ChildHotelComponent;
  let fixture: ComponentFixture<ChildHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildHotelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
