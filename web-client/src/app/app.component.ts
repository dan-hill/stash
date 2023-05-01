import {Component, OnInit} from '@angular/core';
import {AuthService} from "./services/auth/auth.service";
import {StorageService} from "./services/storage/storage.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
    private authService: AuthService,
    private storage: StorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/stash';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
