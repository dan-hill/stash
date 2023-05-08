import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      console.log('auth.guard.ts: canActivate: authenticated, returning true');
      return true;
    } else {
      console.log(
        'auth.guard.ts: canActivate: not authenticated, redirecting to /login with return url'
      );
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      console.log('auth.guard.ts: canActivate: not authenticated, returning false');
      return false;
    }
  }
}
