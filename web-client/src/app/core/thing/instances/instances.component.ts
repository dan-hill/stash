import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef} from '@angular/core';
import { Instance } from "../../../models/instance/instance.model";
import { Thing } from "../../../models/thing/thing.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StashService } from "../../../services/stash/stash.service";
import { NzCascaderOption } from "ng-zorro-antd/cascader";
import {EMPTY, Observable, of, switchMap, take} from "rxjs";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";
import {NzContextMenuService, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent implements OnInit {
  @Input() thing: Observable<Thing | null> = EMPTY;
  @Output() thingChange = new EventEmitter<string>();

  @Input() things: Observable<Thing[]> = of([]);
  @Output() thingsChange = new EventEmitter<string>();

  instances: Instance[] = [];

  visible: boolean = false;
  editingInstance: Observable<Instance> = new Observable<Instance>();
  tplModalButtonLoading: boolean = false;
  createOrUpdateInstanceForm!: FormGroup;
  nzOptions: NzCascaderOption[] | null = null;

  constructor(
    private fb: FormBuilder,
    private stash: StashService,
    private modal: NzModalService,
    private nzContextMenuService: NzContextMenuService) { }



  ngOnInit() {
    this.createOrUpdateInstanceForm = this.fb.group({
      name: [null, [Validators.required]],
      instance: [null],
      minimum_quantity: [null],
      transferable: [null],
      quantity: [null],
    });

    setTimeout(() => {
      this.things.subscribe(things => {
        this.nzOptions = this.mapThingsToOptions(things);
      });
    }, 100);

    this.thing.subscribe(thing => {
      this.instances = this.getInstances(thing);
    });


  }
  mapThingsToOptions(things: Thing[] | null): NzCascaderOption[] {
    if (things === null) return [];

    return things.filter(thing => {
      return thing.instances.length > 0;
    } ).map(thing => {
      return {
        value: thing._id,
        label: thing.name,
        isLeaf: false,
        children: thing.instances.map(instance => {
          return {
            value: instance._id,
            label: instance.name,
            isLeaf: true,
          }
        })
      }
    });
  }
  getInstances(thing: Thing | null): Instance[] {
    return thing?.instances ?? [];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
    if (changes['thing']) {
      this.thing.subscribe(thing => {
        this.instances = this.getInstances(thing);
      });
    }
  }

  createModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, instance: Instance | null): void {

    if(instance === null) {
      this.modalTitle = 'Create Instance';
      instance = new Instance();
    } else {
      this.modalTitle = 'Edit Instance';
    }

    this.editingInstance = of(instance);
    this.createOrUpdateInstanceForm.setValue({
      name: instance.name,
      instance: instance.instance?._id ?? null,
      minimum_quantity: instance.minimum_quantity,
      quantity: instance.quantity,
      transferable: instance.transferable ?? false,
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
    this.editingInstance = new Observable<Instance>();
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      modelRef.destroy();
    }, 1000);
  }

  onChanges($event: any) {
    console.log('Selected value:', $event);
  }


  protected readonly Instance = Instance;
  modalTitle: string = '';

  updateInstance( modelRef: NzModalRef) {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      if (this.editingInstance === null) return;
      this.editingInstance.pipe(take(1)).subscribe(instance => {
        console.log(this.createOrUpdateInstanceForm.value.instance[1])
        this.stash.updateInstance(instance._id, {...this.createOrUpdateInstanceForm.value, instance: this.createOrUpdateInstanceForm.value.instance[1]}).subscribe({
          next: query => {
            console.log('created instance');
            this.thingChange.emit('changed');
            this.destroyTplModal(modelRef);
          },
          error: error => {
            console.error(error);
          }
        });
      });
    })
  }

  createInstance(modelRef: NzModalRef) {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      if (this.editingInstance === null) return;
      this.editingInstance.pipe(take(1)).subscribe(instance => {
        this.stash.createInstance(thing._id, this.createOrUpdateInstanceForm.value).subscribe({
          next: query => {
            this.thingChange.emit('changed');
            this.destroyTplModal(modelRef);
          },
          error: error => {
            console.error(error);
          }
        });
      });
    })
  }

  deleteInstance(modelRef: NzModalRef): void {
    this.editingInstance.subscribe(instance => {
      if (instance._id === undefined) return;
      this.thing.pipe(take(1)).subscribe(thing => {
        if (thing === null) return;
        this.stash.deleteInstance(instance._id, thing._id ).subscribe({
          next: query => {
            this.thingChange.emit('changed');
            this.visible = false;
            this.destroyTplModal(modelRef);
          },
          error: error => {
            console.error(error);
          }
        });
      })

    })
  }

  deleteInstanceContext(instance: Instance): void {
    if (instance._id === undefined) return;
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      this.stash.deleteInstance(instance._id, thing._id ).subscribe({
        next: query => {
          this.thingChange.emit('changed');
          this.visible = false;
        },
        error: error => {
          console.error(error);
        }
      });
    })
  }
  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  closeMenu(): void {
    this.nzContextMenuService.close();
  }
}
