import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { KeyValueUser, ProductKeyAndType, User } from 'src/app/interfaces';
@Injectable({
  providedIn: 'root',
})
export class LoginAndRegistrationService {
  public loggedUser = new BehaviorSubject<KeyValueUser | undefined>(undefined);
  public url =
    'https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/musicShopUsers';
  constructor(
    private auth: AngularFireAuth,
    private http: HttpClient,
    private router: Router,
  ) {}
  public likedProducts = new BehaviorSubject<ProductKeyAndType[]>([]);
  likedProducts$ = this.likedProducts.asObservable();

  set likedProductsSetter(products: ProductKeyAndType[]) {
    this.likedProducts.next(products);
  }

  get likedProductsGetter() {
    return this.likedProducts.value;
  }
  public loginWithGoogle() {
    this.auth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
        this.findUser(res.user?.email!).subscribe((user) => {
          if (user === undefined) {
            this.addUserTodatabase(res.user?.email!, res.user?.photoURL!);
          } else {
            this.findUser(res.user?.email!).subscribe((user) => {
              this.loggedUser.next(user);
              this.likedProducts.next(user?.user.likedProducts!)
              this.router.navigate(['/products']);
              localStorage.setItem('currentUser', JSON.stringify(user));
            });
          }
        });
      },
      (err) => {
        alert(err.mesasage);
      }
    );
  }

  public loginWithEmailAndPassword(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        this.findUser(res.user?.email!).subscribe((user) => {
          this.loggedUser.next(user);
          this.likedProducts.next(user?.user.likedProducts!)
          this.router.navigate(['/products']);
          localStorage.setItem('currentUser', JSON.stringify(user));
        });
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  public registration(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password).then(
      (res) => {
        this.addUserTodatabase(res.user?.email!);
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  addUserTodatabase(email: string, photoUrl?: string) {
    const newUser: User = {
      email: email,
      isAdmin: false,
      photoUrl: photoUrl,
      address: '',
      likedProducts: [{ key: 'none', category: 'other' }],
      purchasedProducts: [
        {
          email: email,
          userId: email,
          date: new Date(),
          totalPrice: 0,
          products: [
            {
              quantity: -1,
              product: {
                key: 'unknown',
                product: {
                  category: 'other',
                  model: 'none',
                  price: -1,
                  quantity: -1,
                  discount: -1,
                  photoUrl: ['none'],
                },
              },
            },
          ],
        },
      ],
    };
    this.http.post(`${this.url}.json`, newUser).subscribe(
      () => {
        console.log('User created succesfully');
      },
      (err) => {
        alert(err.message);
      }
    );
  }
  findUser(email: string): Observable<KeyValueUser | undefined> {
    return this.http.get<User[]>(`${this.url}.json`).pipe(
      map((res) => {
        let targetUser: User | undefined = undefined;
        let targetKey: string = '';
        Object.entries(res).find(([key, user]) => {
          if (user.email === email) {
            targetUser = user;
            targetKey = key;
          }
        });
        if (targetKey && targetUser) {
          return { user: targetUser, key: targetKey };
        } else {
          return undefined;
        }
      }),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      })
    );
  }
  findUserById(id: string) {
    return this.http.get<User>(`${this.url}/${id}.json`).pipe(
      map((response: User) => {
        return response.email;
      })
    );
  }
  checkIfLoggedIn() {
    if (localStorage.getItem('currentUser')) {
      let user:KeyValueUser | undefined = JSON.parse(localStorage.getItem('currentUser')!);
      this.loggedUser.next(user);
      this.likedProducts.next(user?.user.likedProducts!)
    }
  }
  logOut() {
    localStorage.removeItem('currentUser');
    this.likedProducts.next([])
    this.loggedUser.next(undefined);
  }
}
