import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {TOKEN} from "../../constants/app.constant";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageSub= new Subject<String>();

  constructor() { }

  getAccessToken(){
    return localStorage[TOKEN];
  }

  setAccessToken(token: string) {
    localStorage.setItem(TOKEN, token);
    this.storageSub.next('changed');
  }

  getRefreshToken(){
    return localStorage['refresh_token'];
  }

  setRefreshToken(token: string) {
    localStorage.setItem('refresh_token', token);
    this.storageSub.next('changed');
  }
}
