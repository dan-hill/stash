import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { StashComponent } from './core/stash/stash.component';
import { ThingComponent } from './core/thing/thing.component';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'stash', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'stash', canActivate: [AuthGuard], component: StashComponent, data: {
      breadcrumb: 'stash'
    },children: [
      { path: ':id', canActivate: [AuthGuard], component: ThingComponent, data: {
          breadcrumb: '{{thing.name}}'
        } }, ]
  },
  // ...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
