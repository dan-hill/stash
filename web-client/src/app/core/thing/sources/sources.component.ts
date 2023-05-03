import {Component, Input} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent {
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
