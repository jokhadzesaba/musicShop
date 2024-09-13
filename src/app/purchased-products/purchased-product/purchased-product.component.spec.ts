import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedProductComponent } from './purchased-product.component';

describe('PurchasedProductComponent', () => {
  let component: PurchasedProductComponent;
  let fixture: ComponentFixture<PurchasedProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasedProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
