import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import {LoginComponent} from "./core/login/login.component";
import {StashComponent} from "./core/stash/stash.component";
import { GraphQLModule } from './graphql.module';
import {NzCardModule} from "ng-zorro-antd/card";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {ThingComponent} from "./core/thing/thing.component";
import { KtdGridModule } from '@katoid/angular-grid-layout';
import {AttributesComponent} from "./core/thing/attributes/attributes.component";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {SourcesComponent} from "./core/thing/sources/sources.component";
import {InstancesComponent} from "./core/thing/instances/instances.component";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {AuthInterceptor} from "./services/auth/auth.interceptor";
import {ThingListComponent} from "./core/stash/thing-list/thing-list.component";
import {NzTabsModule} from "ng-zorro-antd/tabs";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StashComponent,
    ThingComponent,
    AttributesComponent,
    SourcesComponent,
    InstancesComponent,
    ThingListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    GraphQLModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzBreadCrumbModule,
    NzTreeModule,
    KtdGridModule,
    NzTableModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzTabsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
