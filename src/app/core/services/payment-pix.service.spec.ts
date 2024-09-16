import { TestBed } from '@angular/core/testing';

import { PaymentPixService } from './payment-pix.service';

describe('PaymentPixService', () => {
  let service: PaymentPixService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentPixService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
