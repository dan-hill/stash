import {Component, OnInit} from '@angular/core';
import {StashService} from "../../services/stash/stash.service";
import {Thing} from "../../models/thing/thing.model";
import _ from "lodash";
import {NzFormatEmitEvent} from "ng-zorro-antd/tree";
@Component({
  selector: 'app-stash',
  templateUrl: './stash.component.html',
  styleUrls: ['./stash.component.css']
})
export class StashComponent implements OnInit {
  private things: Thing[] = [];
  public nodes: any[] = [];
  constructor(private stash: StashService) { }

  ngOnInit() {
    this.stash.getThings().subscribe((data: any) => {
      this.things = data.data.things;
      this.nodes = _(this.things)
        .map((thing: Thing) => {return thing.category}).uniq()
        .map((category: any) => {
          return { title: category, key: category, expanded: false, children: this.things
              .filter((entity: any) => entity.category === category)
              .map((thing: any) => {return {title: thing.name, key: thing.id, isLeaf: true}}) }
      }).value();
    });
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }
}
