import {Component, Input, OnInit} from '@angular/core';
import {NzHeaderComponent} from "ng-zorro-antd/layout";

@Component({
  selector: 'stash-header',
  templateUrl: './stash-header.component.html',
  styleUrls: ['./stash-header.component.css']
})
export class StashHeaderComponent extends NzHeaderComponent implements OnInit {
  @Input() title: string = "";
  ngOnInit(): void {
  }

}
