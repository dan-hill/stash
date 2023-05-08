import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {StorageService} from "../storage/storage.service";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private router: Router)
  { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storage.getAccessToken();

    if (!token || token === 'undefined') {
      return next.handle(req);
    }


    if (!this.authService.isAuthenticated()) {
      this.authService.refreshToken().subscribe((res: any) => {
        this.storage.setAccessToken(res.access_token);
        this.storage.setRefreshToken(res.refresh_token);
      })
    }

    const req1 = req.clone({
      headers: req.headers.set('x-requested-with', token),
    });

    return next.handle(req1);
  }

}

