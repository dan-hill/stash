import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
import {Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import {expand, map} from "rxjs/operators";
import _ from "lodash";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {forkJoin, Observable, of, switchMap} from "rxjs";

export interface TreeNodeInterface {
  key: string;
  name: string;
  age?: number;
  level?: number;
  expand?: boolean;
  address?: string;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
  icon?: string;
}

@Component({
  selector: 'app-thing-list',
  templateUrl: './thing-list.component.html',
  styleUrls: ['./thing-list.component.css']
})
export class ThingListComponent implements OnInit{
  @Input() things: Observable<Thing[]> = of([]);
  @Output() thingsChange = new EventEmitter<string>();
  public nodes: any[] = [];

  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  visible: boolean = false;
  validateForm!: UntypedFormGroup;
  constructor(
    private stash: StashService,
    private router: Router,
    private userService: UserService,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
   this.makeNodes()
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
    });

  }

  getCategories(things: Thing[]): TreeNodeInterface[] {
    return _(things)
      .map((thing: Thing) => thing.category)
      .uniq()
      .filter((category: string) => category !== undefined && category !== null && category !== '')
      .map((category: string) => { return {key: category, name: category, children: [], icon: 'folder'} as TreeNodeInterface;})
      .push({key: 'stash', name: 'Stash', children: [], icon: 'folder'} as TreeNodeInterface)
      .map((category: TreeNodeInterface) => {return {...category, children: this.getCategoryChildren(things, category)}})
      .value();
  }
  getCategoryChildren(things: Thing[], category: TreeNodeInterface): TreeNodeInterface[] {
    if (this.things === null) return [];
    return things.filter((thing: Thing) => {
      if (category.key === 'stash') return thing.category === undefined || thing.category === null || thing.category === '';
      return thing.category === category.key;
    }).map((thing: Thing) => { return {key: thing._id, name: thing.name, children: undefined, parent: category, expand: false, icon: 'file'} as TreeNodeInterface;});
  }


  makeNodes(): void {
    this.things.subscribe((things: Thing[]) => {
      const categories: TreeNodeInterface[] = this.getCategories(things);
      categories.forEach((category: TreeNodeInterface) => {
        this.mapOfExpandedData[category.key] = this.convertTreeToList(category);
      } );
      this.nodes = categories;
    });

  }

  ngOnChanges() {
    console.log('ngOnChanges')
    this.makeNodes();
    console.log(this.nodes)
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    console.log('collapse');
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

  expandNode(node: TreeNodeInterface): void {
    console.log('expand');
    console.log(node);
  }
  openThing(item: any) {
    if (!item.children || item.children.length === 0) {
      this.router.navigateByUrl(`/stash/${item.key}`);
    }
  }

  change(value: boolean): void {
    console.log(value);
  }

  saveThing() {
    console.log(this.validateForm.value);
    this.stash.createThing(this.validateForm.value).subscribe({
      next: (result) =>{
        console.log('Success:', result.createThing);
        this.validateForm.reset();
        this.thingsChange.emit('changed');
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
}
