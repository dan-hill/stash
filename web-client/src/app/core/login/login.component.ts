import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";

import * as _ from "lodash";
import {StorageService} from "../../services/storage/storage.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  validateForm!: UntypedFormGroup;
  userName: string = '';
  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/stash';
      this.router.navigateByUrl(returnUrl);
    }
  }

  onSubmit() {
    console.log('clicked login');
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.authenticate(this._v().email, this._v().password).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          this.storage.setAccessToken(data.access_token);
          this.storage.setRefreshToken(data.refresh_token);

          if (this.authService.isAuthenticated()) {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/stash';
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      });
    }
  }

  _v() {
    return this.loginForm.value;
  }
}
