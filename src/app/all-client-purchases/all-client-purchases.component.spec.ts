import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllClientPurchasesComponent } from './all-client-purchases.component';

describe('AllClientPurchasesComponent', () => {
  let component: AllClientPurchasesComponent;
  let fixture: ComponentFixture<AllClientPurchasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllClientPurchasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllClientPurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
