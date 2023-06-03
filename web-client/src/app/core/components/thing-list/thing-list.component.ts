import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Thing} from "../../../models/thing/thing.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import _ from "lodash";
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable, take} from "rxjs";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {ThingsQuery} from "../../../services/things/things.query";
import {TreeNodeInterface} from "../../../models/tree-node/tree-node.interface";
import {Category} from "../../../models/category/category.model";
import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";
import {CategoryQuery} from "../../../services/category/category.query";
import {ThingsStore} from "../../../services/things/things.store";
import {UIStore} from "../../../state/ui/ui.store";
import {UIQuery} from "../../../state/ui/ui.query";
import {ThingsApi} from "../../../services/things/things.api";

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
  public things: Thing[] = [];
 // public currentThing$: Observable<Thing | null> = this.thingsQuery.selectActive();
  public categories$ = this.categoriesQuery.selectCategories$;
  public categories: Category[] = [];
  public nodes: any[] = [];
  public expandedNodes$ = this.uiQuery.selectThingListExpandedNodes$
  public expandedNodes: any[] = []
  validateForm!: UntypedFormGroup;

  public editingThing: Observable<Thing> = new Observable<Thing>();
  public createOrUpdateThingForm!: FormGroup;
  public tplModalButtonLoading: boolean = false;
  public modalTitle: string = "Create Thing";
  private activatedNode: NzTreeNode | undefined;

  constructor(
    private thingService: ThingsApi,
    private thingsQuery: ThingsQuery,
    private thingsStore: ThingsStore,
    private router: Router,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private route: ActivatedRoute,
    private categoriesQuery: CategoryQuery,
    private uiStore: UIStore,
    private uiQuery: UIQuery
  ) { }

  ngOnInit(): void {
    this.expandedNodes$.subscribe((expandedNodes) => {
      this.expandedNodes = expandedNodes
    })

    this.createOrUpdateThingForm = this.fb.group({
      name: [null, [Validators.required]],
    });

    this.things$.subscribe((things: Thing[]) => {
      this.things = things;
      this.nodes = this.makeNodes(this.things, this.categories);

    });

    this.categories$.subscribe((categories: Category[]) => {
      this.categories = categories;
      this.nodes = this.makeNodes(this.things, this.categories);

    });
  }

  ngOnChanges() {

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
        expanded: this.expandedNodes.includes(category._id),
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
    return categoryNodes;
  }


  async openThing(id: string) {
      await this.router.navigateByUrl(`/stash/${id}`);
  }

  createThing(ref: NzModalRef | undefined) {
    this.thingService.createThing({...this.createOrUpdateThingForm.value, category: this.categories.find((category) => category.name === 'Stash')?._id}).subscribe({
      next: (result) =>{
        this.createOrUpdateThingForm.reset();
        if(ref) this.destroyTplModal(ref)
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
  onExpandChange($event: any){
    this.uiStore.setThingListExpandedNodes($event.keys);
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
    this.thingService.deleteThing(_id).pipe(take(1)).subscribe({
      next: query => {
        this.thingsStore.remove(_id)
        console.log('deleted Thing');
      },
      error: error => {
        console.error(error);
      }
    });
  }

  deleteThingAndModal(_id: string, modelRef: NzModalRef) {
    this.thingService.deleteThing(_id).pipe(take(1)).subscribe({
      next: query => {
        this.thingsStore.remove(_id)
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
        this.thingService.updateThing(thing._id, this.createOrUpdateThingForm.value).pipe(take(1)).subscribe({
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
