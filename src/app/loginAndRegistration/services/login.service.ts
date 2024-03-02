import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider, user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { KeyValueUser, User } from 'src/app/interfaces';
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
    private router: Router
  ) {}
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
              this.router.navigate(['/products']);
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
          this.router.navigate(['/products']);
        });
      },
      (err) => {
        alert(err.message);
        console.log(err.mesasage);
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
      likedProduct: [
        {
          category: 'other',
          model: 'none',
          price: 0,
          quantity: 0,
          discount: 0,
          photoUrl: [],
        },
      ],
      checkout: [
        {
          category: 'other',
          model: 'none',
          price: 0,
          quantity: 0,
          discount: 0,
          photoUrl: [],
        },
      ],
      cart: [
        {
          category: 'other',
          model: 'none',
          price: 0,
          quantity: 0,
          discount: 0,
          photoUrl: [],
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
  findUserById(id:string){
    return this.http.get<User>(`${this.url}/${id}.json`).pipe(map((response:User)=>{
        return response.email
    }))
  }
}
