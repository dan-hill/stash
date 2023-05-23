import {Component, Output, EventEmitter, Input} from '@angular/core';
import {NzButtonSize} from "ng-zorro-antd/button";

@Component({
  selector: 'app-stash-button',
  templateUrl: './stash-button.component.html',
  styleUrls: ['./stash-button.component.css']
})
export class StashButtonComponent {
  @Input() icon: string | undefined;
  @Input() content: string | undefined;
  @Input() loading: boolean = false;
  @Input() size: NzButtonSize | undefined;
  @Output() onClick = new EventEmitter<void>();
}
