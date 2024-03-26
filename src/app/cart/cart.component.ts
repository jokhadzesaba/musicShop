import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  @Input() showCart?: boolean = true;
}
