import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor(){}

  encrypt(str:any){
    str = btoa(str);
    str = btoa(str);
    return str;
  }

  desencrypt(str:any){
    str = atob(str);
    str = atob(str);
    return str;
  }

}