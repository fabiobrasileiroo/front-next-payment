import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPixComponent } from './payment-pix.component';

describe('PaymentPixComponent', () => {
  let component: PaymentPixComponent;
  let fixture: ComponentFixture<PaymentPixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentPixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
