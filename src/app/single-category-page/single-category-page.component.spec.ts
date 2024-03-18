import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCategoryPageComponent } from './single-category-page.component';

describe('SingleCategoryPageComponent', () => {
  let component: SingleCategoryPageComponent;
  let fixture: ComponentFixture<SingleCategoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleCategoryPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SingleCategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
