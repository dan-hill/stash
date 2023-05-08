import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import {AuthService} from "./services/auth/auth.service";

@Injectable({
  providedIn: 'root',
})
export class RootResolver implements Resolve<void> {
  constructor(private authService: AuthService, private router: Router) {}

  resolve(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/stash');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
