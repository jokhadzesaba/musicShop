import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public dropDown: boolean = false;

  public changeDropDown() {
    console.log(this.dropDown);

    this.dropDown = !this.dropDown;
  }
}
