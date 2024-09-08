import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { IPayPalConfig, ICreateOrderRequest, NgxPayPalModule } from 'ngx-paypal';
@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [NgxPayPalModule],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.scss',
})
export class PaypalComponent implements OnInit {
  public paypalConfig?: IPayPalConfig;
  @Input() totalPrice?:number
  
  constructor(private cookieService:CookieService){}
  ngOnInit(): void {
    this.initConfig()
    this.setCookie('paypal_cookie', 'some_value');
    const cookieValue = this.getCookie('paypal_cookie');
    console.log('PayPal Cookie Value: ', cookieValue);
  }
  private initConfig() {
    this.paypalConfig = {
      currency: 'USD',
      clientId: 'AQ7YdqsTpxT_ouN31zRUyhQFvr1mMuO8rfcrWINg6SE5BFQ0l67cIFOhsNjIMdaxDU2RU42hI8yx2IxG',
      createOrderOnClient: (data) => {
        return <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: '0.1',
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: '0.1',
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
                    value: '0.1',
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
        console.log('payment approved: ', data, actions);
      },
      onCancel: (data, action) => {
        console.log('payment cancelled: ', data, action);
      },
      onClick: (data, action) => {
        console.log('Onclick: ', data, action);
      },
    };
  }
  setCookie(name: string, value: string) {
    this.cookieService.set(name, value, undefined, '/', undefined, true, 'None');
  }

  getCookie(name: string) {
    return this.cookieService.get(name);
  }

  deleteCookie(name: string) {
    this.cookieService.delete(name);
  }
}
