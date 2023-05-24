import {Input, Component, OnInit, SimpleChanges, OnChanges, EventEmitter, Output, TemplateRef} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
import {EMPTY, Observable, of, switchMap, take} from "rxjs";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  attributes: Attribute[] = [];
  @Input() thing: Observable<Thing | null> = EMPTY;
  @Output() thingChange = new EventEmitter<string>();
  editId: string | null = null;
  visible: boolean = false;
  private editingAttribute: Observable<Attribute> = new Observable<Attribute>();
  createOrUpdateAttributeForm!: FormGroup;
  public tplModalButtonLoading: boolean = false;
  public modalTitle: string = "Create Attribute";

  constructor(
    private fb: FormBuilder,
    private stash: StashService,
    private modal: NzModalService) { }

  ngOnInit() {
    this.createOrUpdateAttributeForm = this.fb.group({
      key: [null, [Validators.required]],
      value: [null],
    });

    this.thing.subscribe(thing => {
      this.attributes = this.getAttributes(thing);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
    if (changes['thing']) {
      this.thing.subscribe(thing => {
        this.attributes = this.getAttributes(thing);
      });
    }
  }

  getAttributes(thing: Thing | null): Attribute[] {
    return thing?.attributes ?? [];
  }

  updateAttribute( modelRef: NzModalRef) {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      if (this.editingAttribute === null) return;
      this.editingAttribute.pipe(take(1)).subscribe(attribute => {
        this.stash.updateAttribute(attribute._id, this.createOrUpdateAttributeForm.value).subscribe({
          next: query => {
            console.log('created attribute');
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

  deleteAttribute(modelRef: NzModalRef): void {
    this.editingAttribute.subscribe(attribute => {
      if (attribute._id === undefined) return;
      this.thing.pipe(take(1)).subscribe(thing => {
        if (thing === null) return;
        this.stash.deleteAttribute(attribute._id, thing._id ).subscribe({
          next: query => {
            this.thingChange.emit('changed');
            this.destroyTplModal(modelRef);
          },
          error: error => {
            console.error(error);
          }
        });
      })

    })
  }

createAttribute(modelRef: NzModalRef): void {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      this.stash.createAttribute(thing._id, this.createOrUpdateAttributeForm.value).subscribe({
        next: query => {
          console.log('created attribute');
          this.thingChange.emit('changed');
          this.destroyTplModal(modelRef);
        },
        error: error => {
          console.error(error);
        }
      });
    })
}


  createModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, attribute: Attribute | null): void {

    if(attribute === null) {
      this.modalTitle = 'Create Attribute';
      attribute = new Attribute();
    } else {
      this.modalTitle = 'Edit Attribute';
    }

    this.editingAttribute = of(attribute);
    this.createOrUpdateAttributeForm.setValue({
      value: attribute.value,
      key: attribute.key,
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
    this.editingAttribute = new Observable<Attribute>();
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      modelRef.destroy();
    }, 1000);
  }
}
