import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TopProductsComponent implements OnInit {
  public index = 0;
  public imgUrls = [
    'assets/guitar1.jpg',
    'assets/piano.png',
    'assets/drum.avif',
    'assets/bass.webp',
  ];
  public img = this.imgUrls[0];
  private intervalSubscription: Subscription | undefined;
  ngOnInit(): void {
    this.startTimeChangeInterval();
  }
  startTimeChangeInterval() {
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.changeImgUp();
    });
  }
  changeImgUp() {
    if (this.index === 3) {
      this.index = 0;
      this.img = this.imgUrls[this.index];
    } else {
      this.img = this.imgUrls[this.index + 1];
      this.index++;
    }
    this.clearInterval();
  }
  changeImgDown() {
    if (this.index === 0) {
      this.index = 3;
      this.img = this.imgUrls[this.index];
    } else {
      this.img = this.imgUrls[this.index - 1];
      this.index--;
    }
    this.clearInterval();
  }
  changeIndex(index: number) {
    this.index = index;
    this.img = this.imgUrls[index];
    this.clearInterval();
  }
  clearInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription?.unsubscribe();
    }
    this.startTimeChangeInterval();
  }
}
