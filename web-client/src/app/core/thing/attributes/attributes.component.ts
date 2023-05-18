import {Input, Component, OnInit, SimpleChanges, OnChanges, EventEmitter, Output} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
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

  key: string = '';
  value: string = '';

  startEdit(data: any): void {
    this.editId = data._id;
    this.key = data.key;
    this.value = data.value;
  }

  stopEdit(data: any): void {
    this.updateAttribute(data._id, {key: this.key, value: this.value});
    this.editId = null;
  }

updateAttribute(id: string, input: any): void {
    this.stash.updateAttribute(id, input).pipe(
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
  deleteAttribute(id: string): void {
    this.stash.deleteAttribute(id, this.thing._id ).pipe(
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
