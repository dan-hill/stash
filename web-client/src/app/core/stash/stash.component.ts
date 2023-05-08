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
  selector: 'app-stash',
  templateUrl: './stash.component.html',
  styleUrls: ['./stash.component.css']
})
export class StashComponent implements OnInit {
  private things: Observable<{ things: Thing[] }> = new Observable<{ things: Thing[] }>();
  public nodes: any[] = [];
  public user: Observable<User> = new Observable<User>();
  constructor(
    private stash: StashService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.user = this.userService.getMe();
    this.things = this.stash.getThings();

    this.things.pipe(
      map(response => {
        const categories = this.getCategories(response.things);
        console.log(categories);
        const nodes = categories.map((category: any) => {
          return {
            name: category,
            key: '1',
            expand: false,
            children: response.things
              .filter((entity: any) => entity.category === category)
              .map((thing: any) => {
                return {
                  name: thing.name,
                  key: thing._id,
                };
              }),
          };
        });
        console.log(nodes)
        return nodes;
      })
    ).subscribe(nodes => {
      this.nodes = nodes; // Assign the new nodes first
      this.nodes.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });
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
  nzEvent(event: NzFormatEmitEvent): void {
    if(event.keys) {
      const id = event.keys[0];
      this.router.navigateByUrl(`/stash/${id}`);
    }
  }

  expandTreeNode(data: NzTreeNode | NzFormatEmitEvent): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }


  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

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

}
