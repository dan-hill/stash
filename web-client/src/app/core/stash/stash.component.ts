import {Component, OnInit} from '@angular/core';
import {StashService} from "../../services/stash/stash.service";
import {Thing} from "../../models/thing/thing.model";
import _ from "lodash";
import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";
import {Router} from "@angular/router";
import {User} from "../../models/user/user.model";
import {UserService} from "../../services/user/user.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {KtdGridLayout, ktdTrackById} from "@katoid/angular-grid-layout";

@Component({
  selector: 'app-stash',
  templateUrl: './stash.component.html',
  styleUrls: ['./stash.component.css']
})
export class StashComponent implements OnInit {
  public things: Observable<Thing[]> = new Observable<Thing[]>();
  public user: Observable<User> = new Observable<User>();
  cols: number = 100;
  rowHeight: number = 10;
  layout: KtdGridLayout = [
    {id: 'thing-list', x: 0, y: 0, w: 15, h: 25},
    {id: 'instances', x: 3, y: 0, w: 3, h: 3},
    {id: '2', x: 0, y: 3, w: 3, h: 3, minW: 2, minH: 3},
    {id: '3', x: 3, y: 3, w: 3, h: 3, minW: 2, maxW: 3, minH: 2, maxH: 5},
  ];
  trackById = ktdTrackById
  constructor(
    private stash: StashService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.getMe();
    this.things = this.stash.getThings();
  }

  onLayoutUpdated(layout: KtdGridLayout) {
    this.layout = layout;
  }

  onThingsChange($event: string) {
    console.log($event);
    this.things = this.stash.getThings();
  }
}
