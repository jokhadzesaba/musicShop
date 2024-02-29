import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';
@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  private authService = inject(LoginAndRegistrationService);
  private router = inject(Router);
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const userId = route.params['id'];
    return this.authService.findUserById(userId).pipe(
      map((email) => {
        return this.authService.loggedUser.value?.user.email === email;
      }),
      tap((isMatch) => {
        if (!isMatch) {
          alert('Access Denied!');
          this.router.navigate(['/products']);
        }
      })
    );
  }
}
