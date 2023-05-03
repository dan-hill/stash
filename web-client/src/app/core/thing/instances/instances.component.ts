import {Component, Input} from '@angular/core';
import {Attribute} from "../../../models/attribute/attribute.model";
import {Instance} from "../../../models/instance/instance.model";

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent {
  @Input() instances: Instance[] = [];
  editId: string | null = null;
  constructor() {

  }

  ngOnInit() {
    console.log(this.instances)
  }

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }


  deleteRow(id: string): void {
    this.instances = this.instances.filter(d => d._id !== id);
  }
}
