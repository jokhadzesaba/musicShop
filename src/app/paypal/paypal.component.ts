import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import {
  IPayPalConfig,
  ICreateOrderRequest,
  NgxPayPalModule,
} from 'ngx-paypal';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { Cart } from '../interfaces';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [NgxPayPalModule],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.scss',
})
export class PaypalComponent implements OnInit {
  public paypalConfig?: IPayPalConfig;
  @Input() totalPrice?: number;
  @Input() cartArr$?: Observable<Cart[]> ;
  public cartArr?:Cart[] ; 
  public userId:string = ''
  public userEmail:string = ''
  constructor(
    private sharedService: SharedServiceService,
    private authService:LoginAndRegistrationService
  ) {}
  ngOnInit(): void {
    this.authService.loggedUser.subscribe(res=>{
      if (res && res.user.email) {
        this.userId = res?.key;
        this.userEmail = res?.user.email
      }
    })
    this.cartArr$?.subscribe(res=>{
      this.cartArr = res
    })
    this.initConfig();
  }
  public update() {
    if (this.userEmail) {
      this.authService.findUser(this.userEmail).subscribe((res) => {
        this.authService.loggedUser.next(res)
        ;
      });
    } else {
      throw new Error('no user email found');
    }
  }
  private initConfig() {
    this.paypalConfig = {
      currency: 'USD',
      clientId:
        'AQ7YdqsTpxT_ouN31zRUyhQFvr1mMuO8rfcrWINg6SE5BFQ0l67cIFOhsNjIMdaxDU2RU42hI8yx2IxG',
      createOrderOnClient: (data) => {
        return <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.totalPrice?.toString(),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.totalPrice?.toString(),
                  },
                },
              },
              items: [
                {
                  name: 'Music Shop Products',
                  quantity: '1',
                  category: 'PHYSICAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: this.totalPrice?.toString(),
                  },
                },
              ],
            },
          ],
        };
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        if (this.cartArr && this.totalPrice) {
          this.sharedService.buyProducts(this.cartArr, this.totalPrice,this.userEmail,this.userId);
          this.update()
          
          console.log('payment approved: ', data, actions);
        }
      },
      onCancel: (data, action) => {
        console.log('payment cancelled: ', data, action);
      },
      onClick: (data, action) => {
        console.log('Onclick: ', data, action);
      },
    };
  }
}
