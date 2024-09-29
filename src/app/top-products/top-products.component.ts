import { ChangeDetectorRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { ProductKeyValue } from '../interfaces';
import { ShareDataService } from '../sharedService/share-data.service';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopProductsComponent implements OnInit {
  public index = 0;
  public imgUrls: { img: string; key: string }[] = [];
  public img = '';
  public key = '';
  public loading = true;
  constructor(
    private cdr: ChangeDetectorRef,
    private dataShareService: ShareDataService
  ) {}

  private intervalSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.dataShareService.topProducts.subscribe((res) => {
      res.forEach((x) => {
        this.imgUrls.push({ key: x.key, img: x.product.photoUrl[0] });
      });
      if (this.imgUrls.length > 0) {
        this.img = this.imgUrls[0].img;
        this.key = this.imgUrls[0].key;
        this.loading = false;
        this.startTimeChangeInterval();
        this.cdr.detectChanges();
      }
    });
  }
  startTimeChangeInterval() {
    this.intervalSubscription = interval(4000).subscribe(() => {
      this.changeImgUp();
      this.cdr.detectChanges();
    });
  }
  changeImgUp() {
    if (this.index === this.imgUrls.length - 1) {
      this.index = 0;
      this.img = this.imgUrls[this.index].img;
      this.key = this.imgUrls[this.index].key;
    } else {
      this.img = this.imgUrls[this.index + 1].img;
      this.index++;
    }
    this.clearInterval();
  }

  changeImgDown() {
    if (this.index === 0) {
      this.index = this.imgUrls.length - 1;
      this.img = this.imgUrls[this.index].img;
    } else {
      this.img = this.imgUrls[this.index - 1].img;
      this.index--;
    }
    this.clearInterval();
  }
  changeIndex(index: number) {
    this.index = index;
    this.img = this.imgUrls[index].img;
    this.key = this.imgUrls[index].key;
    this.clearInterval();
  }
  clearInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription?.unsubscribe();
    }
    this.startTimeChangeInterval();
  }
}
