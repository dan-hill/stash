import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import {map} from "rxjs/operators";
import _ from "lodash";

export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}

@Component({
  selector: 'app-thing-list',
  templateUrl: './thing-list.component.html',
  styleUrls: ['./thing-list.component.css']
})
export class ThingListComponent implements OnInit{
  @Input() things: Thing[] = [];
  @Output() thingsChange = new EventEmitter<Thing[]>();
  public nodes: any[] = [];

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor(
    private stash: StashService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const categories = this.getCategories(this.things);
    const nodes = categories.map((category: any) => {
      return {
        name: category,
        key: '1',
        expand: false,
        children: this.things
          .filter((entity: any) => entity.category === category)
          .map((thing: any) => {
            return {
              name: thing.name,
              key: thing._id,
            };
          }),
      };
    });

    this.nodes.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
  }

  getCategories(things: Thing[]): string[] {
    return _(things)
      .map((thing: Thing) => {
        return thing.category;
      })
      .uniq()
      .value();
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  openThing(id: string) {
    this.router.navigateByUrl(`/stash/${id}`);
  }
}