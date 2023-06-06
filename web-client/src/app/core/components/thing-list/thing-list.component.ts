import {Component, OnInit, TemplateRef} from '@angular/core';
import {Thing} from "../../../models/thing/thing.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../services/user/user.service";
import _ from "lodash";
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Observable, take} from "rxjs";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {TreeNodeInterface} from "../../../models/tree-node/tree-node.interface";
import {Category} from "../../../models/category/category.model";
import {NzFormatEmitEvent, NzTreeNode} from "ng-zorro-antd/tree";
import {UIStore} from "../../../state/ui/ui.store";
import {UIQuery} from "../../../state/ui/ui.query";
import {CategoryService} from "../../../services/category";
import {ThingsService} from "../../../services/things";

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
  public things$ = this.thingService.getThings()  // Add this line
  public things: Thing[] = [];
 // public currentThing$: Observable<Thing | null> = this.thingsQuery.selectActive();
  public categories$ = this.categoryService.getCategories();
  public categories: Category[] = [];
  public nodes: any[] = [];
  public expandedNodes$ = this.uiQuery.selectThingListExpandedNodes$
  public expandedNodes: any[] = []
  validateForm!: UntypedFormGroup;

  public editingThing: Observable<Thing> = new Observable<Thing>();
  public createOrUpdateThingForm!: FormGroup;
  public createOrUpdateCategoryForm!: FormGroup;

  public tplModalButtonLoading: boolean = false;
  public modalTitle: string = "Create Thing";
  private activatedNode: NzTreeNode | undefined;

  constructor(
    private thingService: ThingsService,
    private categoryService: CategoryService,
    private router: Router,
    private userService: UserService,
    private fb: UntypedFormBuilder,
    private modal: NzModalService,
    private nzContextMenuService: NzContextMenuService,
    private route: ActivatedRoute,
    private uiStore: UIStore,
    private uiQuery: UIQuery
  ) { }

  ngOnInit(): void {
    this.createOrUpdateThingForm = this.fb.group({
      name: [null, [Validators.required]],
    });
    this.createOrUpdateCategoryForm = this.fb.group({
      name: [null, [Validators.required]],
    });

    this.things$.subscribe((things: Thing[]) => {
      console.log('things changed')
      this.things = things;
      this.nodes = this.makeNodes(this.things, this.categories);
    });

    this.categories$.subscribe((categories: Category[]) => {
      console.log('categories changed')
      this.categories = categories;
      this.nodes = this.makeNodes(this.things, this.categories);
    });

    this.expandedNodes$.subscribe((expandedNodes) => {
      this.expandedNodes = expandedNodes
    })
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
      const thing: Thing = this.things.find((thing: Thing) => thing._id === treeNode.key) ?? new Thing();
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
  }

  createCreateThingModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {
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
  }

  createEditCategoryModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, node: Node): void {
    const editingCategory = this.categories.find((category: Category) => category._id === node.key);
    if (!editingCategory) return;

    this.createOrUpdateCategoryForm.setValue({
      name: editingCategory?.name
    });
    this.modal.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: true,
      nzOnOk: () => console.log('Click ok')
    });
  }

  createCreateCategoryModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>): void {

    this.createOrUpdateCategoryForm.setValue({
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
      },
      error: error => {
        console.error(error);
      }
    });
  }

  deleteThingAndModal(_id: string, modelRef: NzModalRef) {
    this.thingService.deleteThing(_id).pipe(take(1)).subscribe({
      next: query => {
        this.destroyTplModal(modelRef);
      },
      error: error => {
        console.error(error);
      }
    });
  }
  updateThing(treeNode: TreeNodeInterface, modelRef: NzModalRef | void) {

        const thing = this.things.find((thing: Thing) => thing._id === treeNode.key) ?? null;
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

  updateCategory(treeNode: TreeNodeInterface, modelRef: NzModalRef | void) {

      const category = this.categories.find((category: Category) => category._id === treeNode.key) ?? null;
      if (category === null) return;
      this.categoryService.updateCategory(category._id, this.createOrUpdateCategoryForm.value).pipe(take(1)).subscribe({
        next: query => {
          if(modelRef) this.destroyTplModal(modelRef);
        },
        error: error => {
          console.error(error);
        }
      });

  }

  deleteCategory(node: Node, ref: NzModalRef | undefined) {
    this.categoryService.deleteCategory(node.key).pipe(take(1)).subscribe({
      next: query => {
        if(ref) this.destroyTplModal(ref);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  createCategory(ref: NzModalRef) {
    this.categoryService.createCategory(this.createOrUpdateCategoryForm.value).pipe(take(1)).subscribe({
      next: query => {
        if(ref) this.destroyTplModal(ref);
      },
      error: error => {
        console.error(error);
      }
    })
  }
}
