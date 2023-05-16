import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Attribute } from "../../../models/attribute/attribute.model";
import { Instance } from "../../../models/instance/instance.model";
import { Thing } from "../../../models/thing/thing.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StashService } from "../../../services/stash/stash.service";
import { NzCascaderOption } from "ng-zorro-antd/cascader";
import { EMPTY, Observable, of } from "rxjs";

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
      targetThing: [null, [Validators.required]]
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
    console.log(changes)
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

  deleteRow(id: string): void {
  }

  createInstance() {
    this.thing.subscribe(thing => {
      if (thing === null) return;

      this.stash.createInstance(thing._id, { thing: this.validateForm.value.targetThing[0] }).subscribe({
        next: query => {
          this.thingChange.emit('changed');
          console.log(query);
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
