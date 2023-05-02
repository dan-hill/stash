import {Input, Component, OnInit} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  @Input() attributes: Attribute[] = [];
  editId: string | null = null;
  constructor() {

  }

  ngOnInit() {

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
}
