import { Component, EventEmitter, Output,} from '@angular/core';
import { FormGroup, FormBuilder,ReactiveFormsModule, Validators } from '@angular/forms';import { ProductForm } from '../interfaces';
;

@Component({
  selector: 'app-reusable-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reusable-form.component.html',
  styleUrl: './reusable-form.component.scss'
})
export class ReusableFormComponent {
  productForm: FormGroup;
  @Output() formSubmitted = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      model: [''],
      price: ['',Validators.pattern('^[0-9]*$')],
      discount: ['',Validators.pattern('^[0-9]*$')],
      quantity: ['',Validators.pattern('^[0-9]*$')],
      description:['']
    });
  }

  onSubmit() {
      this.formSubmitted.emit(this.productForm.value);
  }
}
