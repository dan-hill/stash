import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Instance } from "../../../models/instance/instance.model";
import { Thing } from "../../../models/thing/thing.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StashService } from "../../../services/stash/stash.service";
import { NzCascaderOption } from "ng-zorro-antd/cascader";
import {EMPTY, Observable, of, switchMap, take} from "rxjs";

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

  editId: string | null = null;
  visible: boolean = false;
  validateForm!: FormGroup;
  nzOptions: NzCascaderOption[] | null = null;
  values: string[] | null = null;

  constructor(
    private fb: FormBuilder,
    private stash: StashService) { }

  mapThingsToOptions(things: Thing[] | null): NzCascaderOption[] {
    if (things === null) return [];

    return things.map(thing => {
      return {
        value: thing._id,
        label: thing.name,
        isLeaf: true
      }
    });
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]]
    });

    this.thing.subscribe(thing => {
      this.instances = this.getInstances(thing);
    });

    setTimeout(() => {
      this.things.subscribe(things => {
        this.nzOptions = this.mapThingsToOptions(things);
      });
    }, 100);
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

  change(value: boolean): void {
    console.log(value);
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
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

  deleteInstance(id: string): void {
    this.thing.pipe(take(1)).subscribe(thing => {
      if (thing === null) return;
      this.stash.deleteInstance(id, thing._id ).subscribe({
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
  }

  onChanges($event: any) {
    console.log('Selected value:', $event);
  }
}
