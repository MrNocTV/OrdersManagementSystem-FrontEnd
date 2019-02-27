import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCheckingComponent } from './order-checking.component';

describe('OrderCheckingComponent', () => {
  let component: OrderCheckingComponent;
  let fixture: ComponentFixture<OrderCheckingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderCheckingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
