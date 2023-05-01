import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./core/login/login.component";
import {StashComponent} from "./core/stash/stash.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'stash', component: StashComponent },

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
