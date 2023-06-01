import { Store, StoreConfig } from '@datorama/akita';
import {UIState} from "./ui.interface";
import {Injectable} from "@angular/core";

const initialState: UIState = {
  thingListExpandedNodes: []
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ui' })
export class UIStore extends Store<UIState> {
  constructor() {
    super(initialState);
  }

  // you can also add custom methods to your store for updating state
  setThingListExpandedNodes(expandedNodes: any[]) {
    this.update(state => ({ ...state, thingListExpandedNodes: expandedNodes }));
  }

}

export const uiStore = new UIStore();
