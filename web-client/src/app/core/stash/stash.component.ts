import {Component, OnInit, TemplateRef} from '@angular/core';
import {StashService} from "../../services/stash/stash.service";
import {Thing} from "../../models/thing/thing.model";
import _ from "lodash";
import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";
import {Router} from "@angular/router";
import {User} from "../../models/user/user.model";
import {UserService} from "../../services/user/user.service";
import {Observable, of} from "rxjs";
import {ThingsQuery} from "../../state/things.query";
import {CategoriesQuery} from "../../state/categories.query";
import {Category} from "../../models/category/category.model";

@Component({
  selector: 'app-stash',
  templateUrl: './stash.component.html',
  styleUrls: ['./stash.component.css']
})
export class StashComponent implements OnInit {
  public things$!: Observable<Thing[]>;
  public categories$!: Observable<Category[]>;
  public user: Observable<User> = new Observable<User>();

  constructor(
    private stashService: StashService,
    private router: Router,
    private userService: UserService,
    private thingsQuery: ThingsQuery,
    private categoriesQuery: CategoriesQuery
  ) { }

  ngOnInit() {
    this.user = this.userService.getMe();
    this.stashService.getThings().subscribe();
    this.things$ = this.thingsQuery.selectAll();
    this.stashService.getCategories().subscribe();
    this.categories$ = this.categoriesQuery.selectAll();
  }
  onThingsChange($event: string) {
    console.log($event);
    this.stashService.getThings().subscribe();
  }
}
