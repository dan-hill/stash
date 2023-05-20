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
  demoValue: number = 0;
  editingInstance: Observable<Instance> = new Observable<Instance>();

  constructor(
    private fb: FormBuilder,
    private stash: StashService) { }



  ngOnInit() {

    this.thing.subscribe(thing => {
      this.instances = this.getInstances(thing);
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

  change(value: boolean): void {
    console.log(value);
  }

showModal(instance: Instance): void {
    this.editingInstance = of(instance);
    this.visible = true;
}





}
