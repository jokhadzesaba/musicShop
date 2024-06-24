import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductKeyValue } from '../interfaces';

@Component({
  selector: 'app-reusable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reusable-form.component.html',
  styleUrl: './reusable-form.component.scss'
})
export class ReusableFormComponent {
  @Input() product?: ProductKeyValue;
  @Output() formSubmit = new EventEmitter<any>();

  productForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      model: [''],
      price: [''],
      discount: [''],
      quantity: [''],
      description:['']
    });
  }

  ngOnChanges() {
    if (this.product) {
      this.productForm.patchValue({
        model: this.product.product.model,
        price: this.product.product.price,
        discount: this.product.product.discount,
        quantity: this.product.product.quantity,
        description:this.product.product.description
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.formSubmit.emit(this.productForm.value);
    }
  }

}
