import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";
import {Instance} from "../../../models/instance/instance.model";
import {Thing} from "../../../models/thing/thing.model";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {StashService} from "../../../services/stash/stash.service";
import {NzCascaderOption} from "ng-zorro-antd/cascader";
import {EMPTY, Observable, of} from "rxjs";

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
  editId: string | null = null;
  visible: boolean = false;
  validateForm!: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private stash: StashService) {

  }

  mapThingsToOptions(things: Thing[] | null): NzCascaderOption[] {
    if (things === null) return [];

    return things.map(thing => {
      return {
        value: thing._id,
        label: thing.name,
        children: []
      }
    });
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      relationship: [null, [Validators.required]],
      key: [null, [Validators.required]]
    });
    this.thing.subscribe(thing => {
      this.getInstances(thing);
      console.log(thing)
    } );
    setTimeout(() => {
      this.things.subscribe(things => {
        this.nzOptions = this.mapThingsToOptions(things);
      });
    }, 100);
  }

  instances: Instance[] = [];
  getInstances(thing: Thing | null): void {
    if (thing === null) return;
    this.thing.subscribe(thing => {
      this.instances = thing?.instances ?? [];
    })
  }
  ngOnChanges() {
    this.thing.subscribe(thing => {
      this.getInstances(thing);
    } );
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

  saveInstance() {
    this.thing.subscribe(thing => {
      if (thing === null) return;
      console.log(this.validateForm.value)
      console.log(thing._id);
      this.stash.createInstance(thing._id, {thing: this.validateForm.value.key[0]}).subscribe({
        next: query => {
          console.log(query);
        },
        error: error => {
          console.error(error);
        }
      });
    })
  }

  nzOptions: NzCascaderOption[] | null = null;
  values: string[] | null = null;

  onChanges($event: any) {

  }
}
