import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsLikedComponent } from './is-liked.component';

describe('IsLikedComponent', () => {
  let component: IsLikedComponent;
  let fixture: ComponentFixture<IsLikedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsLikedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IsLikedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
