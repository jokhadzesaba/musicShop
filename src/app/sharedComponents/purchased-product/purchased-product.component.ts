import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Purchase } from 'src/app/interfaces';
import { DatePipe } from 'src/app/pipes/date.pipe';
import { UpperCasePipe } from 'src/app/pipes/upper-case.pipe';



@Component({
  selector: 'app-purchased-product',
  standalone: true,
  imports: [CommonModule, UpperCasePipe,DatePipe],
  templateUrl: './purchased-product.component.html',
  styleUrl: './purchased-product.component.scss',
})
export class PurchasedProductComponent {
  @Input() purchase?: Purchase;
  public showMoreItems: boolean = false;
  public changeArrow: boolean = false;
}
