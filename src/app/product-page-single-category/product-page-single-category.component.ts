import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ProductKeyValue } from '../interfaces';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../sharedComponents/card/card.component';
import { ShareDataService } from '../sharedService/share-data.service';

@Component({
  selector: 'app-product-page-single-category',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './product-page-single-category.component.html',
  styleUrl: './product-page-single-category.component.scss',
})
export class ProductPageSingleCategoryComponent implements OnInit {
  public productsArray: ProductKeyValue[] = [];
  @Input() category?: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  @Output() productsImported = new EventEmitter<boolean>(true);
  loading = true;
  public sliceStart = 0;
  public SliceEnd = 6;
  public length = 0;

  constructor(
    private sharedService: SharedServiceService,
    private cd: ChangeDetectorRef,
    private dataShareService: ShareDataService
  ) {}

  ngOnInit(): void {
    if (this.category) {
      this.dataShareService.getData(this.category).subscribe((res) => {
        this.productsArray = res;
        this.length = res.length;
        this.loading = false;
        this.cd.detectChanges();
        this.productsImported.emit(true);
      });
    }
  }
  shiftLeft() {
    if (this.SliceEnd < this.length) {
      this.sliceStart += 1;
      this.SliceEnd += 1;
    }
  }

  shiftRight() {
    if (this.sliceStart > 0) {
      this.sliceStart -= 1;
      this.SliceEnd -= 1;
    }
  }

  onFormSubmitted(data: {
    form: any;
    prodId: string;
    prodCategory: 'guitar' | 'bass' | 'piano' | 'drum' | 'other';
  }) {
    this.sharedService
      .editProduct(data.form, data.prodId, data.prodCategory)
      .subscribe(() => {
        if (data.prodCategory === 'guitar') {
          this.sharedService.updateProductArray(
            data.form,
            this.productsArray,
            data.prodId
          );
        }
        this.cd.detectChanges();
      });
  }
  removeHandler(data: { prodId: string; prodCategory: string }) {
    this.productsArray = this.productsArray.filter(
      (x) => x.key !== data.prodId
    );
    this.cd.detectChanges();
  }

  modifyCatName() {
    if (this.category) {
      return (
        this.category.charAt(0).toUpperCase() +
        this.category.substring(1, this.category.length) +
        's'
      );
    } else {
      return this.category;
    }
  }
}
