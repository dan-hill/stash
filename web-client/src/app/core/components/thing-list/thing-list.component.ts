import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import _ from "lodash";
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable, take} from "rxjs";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ThingsQuery} from "../../../state/things.query";
import {TreeNodeInterface} from "../../../models/tree-node/tree-node.interface";
import {Category} from "../../../models/category/category.model";
import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";
import {CategoriesQuery} from "../../../state/categories.query";

interface Node {
  key: string,
  title: string,
  isLeaf: boolean,
  icon: string,
  expanded: boolean,
  children: Node[]
}
@Component({
  selector: 'app-thing-list',
  templateUrl: './thing-list.component.html',
  styleUrls: ['./thing-list.component.css']
})
export class ThingListComponent implements OnInit{
  public things$ = this.thingsQuery.selectThings$;  // Add this line
  public currentThing$ = this.thingsQuery.selectCurrentThing$;
  public categories$ = this.categoriesQuery.selectCategories$;
  public nodes: any[] = [];

  validateForm!: UntypedFormGroup;

  public editingThing: Observable<Thing> = new Observable<Thing>();
  public createOrUpdateThingForm!: FormGroup;
  public tplModalButtonLoading: boolean = false;
  public modalTitle: string = "Create Thing";
  private activatedNode: NzTreeNode | undefined;

  constructor(
    private stash: StashService,
    private router: Router,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private route: ActivatedRoute,
    private thingsQuery: ThingsQuery,  // Add this line
    private categoriesQuery: CategoriesQuery
  ) { }

  ngOnInit(): void {
    this.createOrUpdateThingForm = this.fb.group({
      name: [null, [Validators.required]],
    });
    this.things$.subscribe((things: Thing[]) => {
      console.log(things)
      this.categories$.subscribe((categories: Category[]) => {
        this.nodes = this.makeNodes(things, categories);
      });
    });
    this.currentThing$.subscribe((thing: Thing | null) => {
      //this.setExpandedCategory(thing?.category || 'Stash');
    });
  }

  ngOnChanges() {
    this.things$.subscribe((things: Thing[]) => {
      this.categories$.subscribe((categories: Category[]) => {
        this.nodes = this.makeNodes(things, categories);
      });
    });
    this.currentThing$.subscribe((thing: Thing | null) => {
      //this.setExpandedCategory(thing?.category || 'Stash');
    });
  }


  setExpandedCategory(category: string): void {
    this.nodes = this.nodes.map((node: TreeNodeInterface) => {
      node.expand = node.key === category;
      return node;
    });
  }

  makeNodes(things: Thing[], categories: Category[]): Node[]{
    if(!categories) console.log('no categories to map');
    if(!things) console.log('no things to map');
    if(!categories) return [];

    const categoryNodes = categories.map(category => {
      return {
        key: category._id,
        title: category.name,
        children: [],
        icon: 'folder',
        expanded: false,
        isLeaf: false,
      } as Node
    })

    categoryNodes.forEach(categoryNode => {
      categoryNode.children = _(things)
          .filter(thing => thing.category?._id === categoryNode.key)
          .map((thing: Thing) => {
            return {
              key: thing._id,
              title: thing.name,
              children: [],
              icon: 'folder',
              expanded: false,
              isLeaf: true
            } as Node
          }).value()
    })
    console.log(categoryNodes)
    return categoryNodes;
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

  async openThing(item: TreeNodeInterface) {
    if (!item.children || item.children.length === 0 ) {
      await this.router.navigateByUrl(`/stash/${item.key}`);
    }
  }

  change(value: boolean): void {
  }

  saveThing() {
    this.stash.createThing(this.validateForm.value).subscribe({
      next: (result) =>{
        this.validateForm.reset();
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }

  createModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, treeNode: TreeNodeInterface): void {
    this.things$.pipe(take(1)).subscribe((things: Thing[]) => {
      const thing: Thing = things.find((thing: Thing) => thing._id === treeNode.key) ?? new Thing();
      if(thing._id === null) {
        this.modalTitle = 'Create Thing';
      } else {
        this.modalTitle = 'Edit Thing';
      }

      this.createOrUpdateThingForm.setValue({
        name: thing.name
      });
      this.modal.create({
        nzTitle: tplTitle,
        nzContent: tplContent,
        nzFooter: tplFooter,
        nzMaskClosable: false,
        nzClosable: true,
        nzOnOk: () => console.log('Click ok')
      });
    } );
  }

  createCreateThingModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
    this.things$.pipe(take(1)).subscribe((things: Thing[]) => {
      this.modalTitle = 'Create Thing';

      this.createOrUpdateThingForm.setValue({
        name: ''
      });
      this.modal.create({
        nzTitle: tplTitle,
        nzContent: tplContent,
        nzFooter: tplFooter,
        nzMaskClosable: false,
        nzClosable: true,
        nzOnOk: () => console.log('Click ok')
      });
    } );
  }


  destroyTplModal(modelRef: NzModalRef): void {
    this.tplModalButtonLoading = true;
    this.editingThing = new Observable<Thing>();
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      modelRef.destroy();
    }, 1000);
  }


  deleteThing(_id: string) {
    this.stash.deleteThing(_id).pipe(take(1)).subscribe({
      next: query => {
        console.log('deleted Thing');
      },
      error: error => {
        console.error(error);
      }
    });
  }

  deleteThingAndModal(_id: string, modelRef: NzModalRef) {
    this.stash.deleteThing(_id).pipe(take(1)).subscribe({
      next: query => {
        console.log('deleted Thing');
        this.destroyTplModal(modelRef);
      },
      error: error => {
        console.error(error);
      }
    });
  }
  updateThing(treeNode: TreeNodeInterface, modelRef: NzModalRef | void) {
    this.things$.pipe(take(1)).subscribe((things: Thing[]) => {

        const thing = things.find((thing: Thing) => thing._id === treeNode.key) ?? null;

        if (thing === null) return;
        this.stash.updateThing(thing._id, this.createOrUpdateThingForm.value).pipe(take(1)).subscribe({
          next: query => {
            console.log('updated Thing');
            if(modelRef) this.destroyTplModal(modelRef);
          },
          error: error => {
            console.error(error);
          }
        });

    });
  }

  createThing(ref: any) {

  }

  openFolder(data: NzTreeNode | NzFormatEmitEvent): void {
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

  activeNode(data: NzFormatEmitEvent): void {
    this.activatedNode = data.node!;
  }


  selectDropdown(): void {
    // do something
  }
}
