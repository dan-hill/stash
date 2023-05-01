import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./core/login/login.component";
import {StashComponent} from "./core/stash/stash.component";
import {ThingComponent} from "./core/thing/thing.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'stash', component: StashComponent, children: [
      { path: ':id', component: ThingComponent },
    ]},

  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
