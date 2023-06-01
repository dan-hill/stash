import { Query } from '@datorama/akita';
import {UIState} from "./ui.interface";
import {uiStore, UIStore} from "./ui.store";
import {Injectable} from "@angular/core";
@Injectable({ providedIn: 'root' })
export class UIQuery extends Query<UIState> {
  constructor(protected override store: UIStore) {
    super(store);
  }

  selectThingListExpandedNodes$ = this.select('thingListExpandedNodes');

}

export const uiQuery = new UIQuery(uiStore);
