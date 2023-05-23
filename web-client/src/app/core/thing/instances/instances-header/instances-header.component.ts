import { Component, Input, OnInit } from '@angular/core';
import {NzHeaderComponent} from "ng-zorro-antd/layout";

@Component({
  selector: 'app-instances-header',
  templateUrl: './instances-header.component.html',
  styleUrls: ['./instances-header.component.css']
})
export class InstancesHeaderComponent extends NzHeaderComponent implements OnInit {
  @Input() title: string = "";
  ngOnInit(): void {
  }
}
