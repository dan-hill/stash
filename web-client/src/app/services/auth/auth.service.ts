import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {StorageService} from "../storage/storage.service";
import {catchError, throwError} from "rxjs";
import {API_TOKEN_REFRESH_URL, API_TOKEN_URL} from "../../constants/api.constants";
import {decodeJwt, JWTPayload} from "jose";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private storage: StorageService
  ) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    if (error.status !== 401) {
      return throwError(errorMessage);
    }
    return '';
  }
  authenticate(email: string, password: string) {
    return this.httpClient.post(API_TOKEN_URL, {
      "email": email,
      "password": password
    });
  }

  refreshToken() {
    return this.httpClient.post(API_TOKEN_REFRESH_URL, {
      "refresh_token": this.storage.getRefreshToken()
    }).pipe(catchError(this.handleError));
  }
  isAuthenticated(): boolean {
    const token = this.storage.getAccessToken();

    if (!token || token === 'undefined') {
      return false;
    }

    let payload: JWTPayload;
    try {
      payload = decodeJwt(token)
    } catch (e) {
      return false;
    }

    return !(!payload.exp || payload.exp * 1000 < Date.now());


  }
}
