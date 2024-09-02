import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPageSingleCategoryComponent } from './product-page-single-category.component';

describe('ProductPageSingleCategoryComponent', () => {
  let component: ProductPageSingleCategoryComponent;
  let fixture: ComponentFixture<ProductPageSingleCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPageSingleCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductPageSingleCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
