import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { ProductKeyValue } from '../interfaces';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPageComponent implements OnInit {
  public guitarProducts?: ProductKeyValue[];
  constructor(
    private sharedService: SharedServiceService,
    private cd: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.sharedService
      .getTypeOfProduct('guitar')
      .subscribe((res: ProductKeyValue[]) => {
        this.guitarProducts = res;
        this.cd.detectChanges();
      });
  }
}
