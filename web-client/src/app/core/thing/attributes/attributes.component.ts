import {Input, Component, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Thing} from "../../../models/thing/thing.model";
import {StashService} from "../../../services/stash/stash.service";
import {Instance} from "../../../models/instance/instance.model";
import {Source} from "../../../models/source/source.model";
import ObjectID from "bson-objectid";
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  attributes: Attribute[] = [];
  @Input() thing: Thing = new Thing()
  editId: string | null = null;
  visible: boolean = false;
  validateForm!: UntypedFormGroup;

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }

  constructor(private fb: UntypedFormBuilder, private stash: StashService) {}

  ngOnInit() {
    console.log(this.thing)
    if (this.thing !== undefined) {
      this.attributes = this.thing.attributes;
    }
    this.validateForm = this.fb.group({
      key: [null, [Validators.required]],
      value: [null, [Validators.required]]
    });
  }
  ngOnChanges(changes: SimpleChanges) {

    console.log(changes['thing'].currentValue);
    this.thing = changes['thing'].currentValue;
      this.attributes = this.thing.attributes;

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

  addAttribute(): void {

  }

  clickMe(): void {
    this.visible = false;
  }

  change(value: boolean): void {
    console.log(value);
  }

  closePopover(): void {
    this.visible = false;
  }

  saveAttribute() {
    this.stash.createAttribute(this.thing._id, this.validateForm.value).subscribe({
      next: (data: any) => {
        console.log(data);
        this.visible = false;

      }
    });
  }

  removeTypename<T>(obj: T): Partial<T> {
    const { __typename, ...rest } = obj as Partial<T & { __typename?: string }>;
    return rest as Partial<T>;
  }
}