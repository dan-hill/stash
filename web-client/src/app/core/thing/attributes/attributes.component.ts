import {Input, Component, OnInit, SimpleChanges, OnChanges, EventEmitter, Output} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
import {Instance} from "../../../models/instance/instance.model";
import {Source} from "../../../models/source/source.model";
import ObjectID from "bson-objectid";
import {switchMap} from "rxjs";
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  attributes: Attribute[] = [];
  @Input() thing: Thing = new Thing();
  @Output() thingChange = new EventEmitter<Thing>();
  editId: string | null = null;
  visible: boolean = false;
  validateForm!: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder, private stash: StashService) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      key: [null, [Validators.required]],
      value: [null, [Validators.required]]
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('thing changed')

  }
  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }


  deleteRow(id: string): void {
    this.attributes = this.attributes.filter(d => d.key !== id);
  }

  change(value: boolean): void {
    console.log(value);
  }

  saveAttribute() {
    if (this.thing && this.thing._id) {
      this.stash.createAttribute(this.thing._id, this.validateForm.value).pipe(
        switchMap(() => this.stash.getThing(this.thing._id))
      ).subscribe({
        next: query => {
          console.log('saved attribute');
        },
        error: error => {
          console.error(error);
        }
      });
    }
  }

}
