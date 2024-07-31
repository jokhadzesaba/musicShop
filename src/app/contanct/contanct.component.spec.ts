import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContanctComponent } from './contanct.component';

describe('ContanctComponent', () => {
  let component: ContanctComponent;
  let fixture: ComponentFixture<ContanctComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContanctComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContanctComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
