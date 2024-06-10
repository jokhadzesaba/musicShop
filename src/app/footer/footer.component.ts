import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule,RouterModule],
})
export class FooterComponent {
  public email = '';
  constructor(private service:LoginAndRegistrationService,private router:Router){
    
  }
  sendEmail() {
    this.email = '';
  }
  navigate(where:string){
    if(where === 'profile'){
      const userKey = this.service.loggedUser.getValue()?.key
      this.router.navigate([`profile/${userKey}`]);
    }    
  }
}
