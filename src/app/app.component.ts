import { Component } from '@angular/core';
import { render } from 'creditcardpayments/creditCardPayments';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'musicShop';
  // constructor() {
  //   render({
  //     id: '#paypalbutton',
  //     currency: 'USD',
  //     value: '00.1',
  //     onApprove: () => {
  //       alert('payment successfull');
  //     },
  //   });
  // }
}
