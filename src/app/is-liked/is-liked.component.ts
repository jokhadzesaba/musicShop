import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { SharedServiceService } from '../sharedService/shared-service.service';
import { LoginAndRegistrationService } from '../loginAndRegistration/services/login.service';

@Component({
  selector: 'app-is-liked',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './is-liked.component.html',
  styleUrls: ['./is-liked.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsLikedComponent implements OnInit {
  @Input() id: string = '';
  @Input() userId: string = '';
  @Input() category?: 'guitar' | 'drum' | 'bass' | 'piano' | 'other';
  public isLiked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private cd: ChangeDetectorRef,
    private service: SharedServiceService,
    private authService: LoginAndRegistrationService
  ) {}

  ngOnInit(): void {

    this.checkIfliked();
  }

  checkIfliked() {
    this.service.checkIfLiked(this.id, this.userId).subscribe((res) => {
      this.isLiked$.next(res);
      console.log('checkIfliked result:', res);
      this.cd.detectChanges();
    });
  }

  likeUnlikeProduct() {
    this.authService.loggedUser.pipe(take(1)).subscribe((res) => {
      if (res !== undefined) {
        this.service
          .likeUnlikeProduct(this.id, res.key, this.category!)
          .subscribe(() => {
            console.log('Like/Unlike action completed');
            this.isLiked$.next(!this.isLiked$.value);
          });
      }
    });
  }
}
