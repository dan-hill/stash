import {Input, Component, OnInit} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";
import ObjectId from 'bson-objectid';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  @Input() attributes: Attribute[] = [];
  editId: string | null = null;
  visible: boolean = false;
  validateForm!: UntypedFormGroup;

  submitForm(): void {
    console.log('submit', this.validateForm.value);
  }

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
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
    const id = new ObjectId().toString()
      this.attributes = [
        ...this.attributes,
        new Attribute(id, '', ''),
      ];
      console.log(this.attributes)
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
}
