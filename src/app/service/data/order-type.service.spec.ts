import { TestBed } from '@angular/core/testing';

import { OrderTypeService } from './order-type.service';

describe('OrderTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderTypeService = TestBed.get(OrderTypeService);
    expect(service).toBeTruthy();
  });
});
