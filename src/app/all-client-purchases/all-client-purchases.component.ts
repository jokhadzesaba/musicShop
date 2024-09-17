import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Purchase } from '../interfaces';
import { CommonModule } from '@angular/common';
import { PurchasedProductComponent } from '../sharedComponents/purchased-product/purchased-product.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-client-purchases',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PurchasedProductComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './all-client-purchases.component.html',
  styleUrl: './all-client-purchases.component.scss',
})
export class AllClientPurchasesComponent implements OnInit {
  public allPurchasedProducts?: Purchase[];
  public searched?: Purchase[];
  public halfLength = 0;
  public length = 0;
  public email = '';
  constructor(private service: SharedServiceService) {}
  ngOnInit(): void {
    this.service.getAllClientPurchases().subscribe((res) => {
      if (res) {
        const sorted = res.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        this.allPurchasedProducts = sorted;
        this.searched = sorted;
        this.length = res.length;
        this.halfLength = Math.ceil(res.length / 2);
      }
    });
  }
  search() {
    if (this.email) {
      this.searched = this.allPurchasedProducts
        ?.filter((purchase) => purchase.email === this.email)
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }
  }
}
