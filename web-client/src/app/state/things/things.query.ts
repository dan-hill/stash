import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ThingsStore, ThingsState } from './things.store';
import { Thing } from '../../models/thing/thing.model';
import {StashService} from "../../services/stash/stash.service";

@Injectable({ providedIn: 'root' })
export class ThingsQuery extends QueryEntity<ThingsState, Thing> {
  constructor(
    protected override store: ThingsStore,
    private stashService: StashService) {
    super(store);
  }

  selectThings$ = this.selectAll();
  selectCurrentThing$ = this.select('currentThing');

}
