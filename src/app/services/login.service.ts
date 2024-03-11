import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../models/users';
import { global } from './global';

@Injectable()
export class LoginServices {
       public url: string;
       token: string = "";
       private isLoggedIn: boolean = false;

    constructor(public _http: HttpClient) {
        this.url = global.url;
    }

    login(user:any):Observable<any>{

        let json =JSON.stringify(user);
        let headers= new HttpHeaders().set('Content-Type','application/json');

        return this._http.post<any>(this.url+'/login',json,{headers:headers})
        .pipe(
            tap(data => {
              // Verifica la respuesta del servidor para determinar si el inicio de sesión fue exitoso
              console.log('data',data);
              
              if (data.success) {
                this.isLoggedIn = true; // Establece isLoggedIn a true si la autenticación es exitosa
                this.getIsLoggedIn();
              }
            })
          );
    }
    getIsLoggedIn(): boolean {
        
        return this.isLoggedIn; // Devuelve el estado actual de isLoggedIn
      }
}