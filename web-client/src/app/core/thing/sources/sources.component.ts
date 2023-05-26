import {Input, Component, OnInit, SimpleChanges, OnChanges, EventEmitter, Output, TemplateRef} from '@angular/core';
import {Source} from "../../../models/source/source.model";
import {FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
import {EMPTY, Observable, of, switchMap, take} from "rxjs";
import {NzModalRef, NzModalService} from "ng-zorro-antd/modal";

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {
  sources: Source[] = [];
  @Input() thing: Observable<Thing | null> = EMPTY;
  @Output() thingChange = new EventEmitter<string>();
  editId: string | null = null;
  visible: boolean = false;
  private editingSource: Observable<Source> = new Observable<Source>();
  createOrUpdateSourceForm!: FormGroup;
  public tplModalButtonLoading: boolean = false;
  public modalTitle: string = "Create Source";

  constructor(
    private fb: FormBuilder,
    private stash: StashService,
    private modal: NzModalService) { }

  ngOnInit() {
    this.createOrUpdateSourceForm = this.fb.group({
      name: [null, [Validators.required]],
      url: [null],
      price: [null],
    });

    this.thing.subscribe(thing => {
      this.sources = this.getSources(thing);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
    if (changes['thing']) {
      this.thing.subscribe(thing => {
        this.sources = this.getSources(thing);
      });
    }
  }

  getSources(thing: Thing | null): Source[] {
    return thing?.sources ?? [];
  }

  updateSource( modelRef: NzModalRef) {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      if (this.editingSource === null) return;
      this.editingSource.pipe(take(1)).subscribe(source => {
        this.stash.updateSource(source._id, this.createOrUpdateSourceForm.value).subscribe({
          next: query => {
            console.log('created source');
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

  deleteSource(modelRef: NzModalRef): void {
    this.editingSource.subscribe(source => {
      if (source._id === undefined) return;
      this.thing.pipe(take(1)).subscribe(thing => {
        if (thing === null) return;
        this.stash.deleteSource(source._id, thing._id ).subscribe({
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

  createSource(modelRef: NzModalRef): void {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      this.stash.createSource(thing._id, this.createOrUpdateSourceForm.value).subscribe({
        next: query => {
          console.log('created source');
          this.thingChange.emit('changed');
          this.destroyTplModal(modelRef);
        },
        error: error => {
          console.error(error);
        }
      });
    })
  }


  createModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, source: Source | null): void {

    if(source === null) {
      this.modalTitle = 'Create Source';
      source = new Source();
    } else {
      this.modalTitle = 'Edit Source';
    }

    this.editingSource = of(source);
    this.createOrUpdateSourceForm.setValue({
      name: source.name,
      price: source.price,
      url: source.url,
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
    this.editingSource = new Observable<Source>();
    setTimeout(() => {
      this.tplModalButtonLoading = false;
      modelRef.destroy();
    }, 1000);
  }
}
