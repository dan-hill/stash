import { Component, Input, OnInit } from '@angular/core';
import {NzHeaderComponent} from "ng-zorro-antd/layout";

@Component({
  selector: 'app-attributes-header',
  templateUrl: './attributes-header.component.html',
  styleUrls: ['./attributes-header.component.css']
})
export class AttributesHeaderComponent extends NzHeaderComponent implements OnInit {
  @Input() title: string = "";
  ngOnInit(): void {
  }
}
