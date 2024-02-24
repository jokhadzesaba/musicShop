import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/interfaces';
@Injectable({
  providedIn: 'root',
})
export class LoginAndRegistrationService {
  constructor(private auth: AngularFireAuth, private http: HttpClient) {}
  public loginWithGoogle() {
    this.auth.signInWithPopup(new GoogleAuthProvider()).then(
      (res) => {
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
        console.log(res.user?.photoURL);
      },
      (err) => {
        alert(err.mesasage);
      }
    );
  }
  public loginWithEmailAndPassword(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password).then(
      (res) => {
        console.log(res.user);
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
        const newUser: User = {
          email: res.user?.email,
          isAdmin: false,
          likedProduct: [],
          checkout: [],
          cart: [],
        };
        this.http
          .post(
            `https://exercise-app-9b873-default-rtdb.europe-west1.firebasedatabase.app/musicShopUsers.json`,
            newUser
          )
          .subscribe(
            () => {
              console.log('User created succesfully');
            },
            (err) => {
              alert(err.message);
            }
          );
      },
      (err) => {
        alert(err.message);
      }
    );
  }
}
