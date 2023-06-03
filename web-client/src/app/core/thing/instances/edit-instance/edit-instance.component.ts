import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EMPTY, Observable, of, take} from "rxjs";
import {Thing} from "../../../../models/thing/thing.model";
import {Instance} from "../../../../models/instance/instance.model";
import {StashService} from "../../../../services/stash/stash.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NzCascaderOption} from "ng-zorro-antd/cascader";
import {ThingsService} from "../../../../services/things";

@Component({
  selector: 'app-edit-instance',
  templateUrl: './edit-instance.component.html',
  styleUrls: ['./edit-instance.component.css']
})
export class EditInstanceComponent implements OnInit {
  @Input() thing: Observable<Thing | null> = EMPTY;
  @Output() thingChange = new EventEmitter<string>();

  @Input() things: Observable<Thing[]> = of([]);
  @Output() thingsChange = new EventEmitter<string>();

  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  @Input() instance: Observable<Instance> = new Observable<Instance>();
  @Output() instanceChange = new EventEmitter<string>();

  isConfirmLoading: boolean = false;
  private visible: boolean = false;
  validateForm!: FormGroup;
  nzOptions: NzCascaderOption[] | null = null;
  demoValue: number = 0;


  constructor(
    private stash: ThingsService,
    private fb: FormBuilder)
  {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      targetThing: [null],
      quantity: [null],
    });

    setTimeout(() => {
      this.things.subscribe(things => {
        this.nzOptions = this.mapThingsToOptions(things);
      });
    }, 100);
  }

  ngOnInit(): void {
    console.log('instance', this.instance);
    this.instance.subscribe(instance => {
      this.validateForm.setValue({name: instance.name});
    });
  }
  mapThingsToOptions(things: Thing[] | null): NzCascaderOption[] {
    if (things === null) return [];

    return things.map(thing => {
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

  onChanges($event: any) {
    console.log('Selected value:', $event);
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  deleteInstance(): void {
    this.instance.subscribe(instance => {
      if (instance._id === undefined) return;
      this.thing.pipe(take(1)).subscribe(thing => {
        if (thing === null) return;
        this.stash.deleteInstance(instance._id, thing._id ).subscribe({
          next: query => {
            this.thingChange.emit('changed');
            this.visible = false;
            console.log('deleted instance');
          },
          error: error => {
            console.error(error);
          }
        });
      })

    })
  }

  createInstance() {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;

      this.stash.createInstance(thing._id, { name: this.validateForm.value.name }).subscribe({
        next: query => {
          console.log('created instance');
          this.thingChange.emit('changed');
        },
        error: error => {
          console.error(error);
        }
      });
    })
  }

}
