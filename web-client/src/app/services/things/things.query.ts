import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ThingsStore, ThingsState } from './things.store';
import { Thing } from '../../models/thing/thing.model';

@Injectable({ providedIn: 'root' })
export class ThingsQuery extends QueryEntity<ThingsState, Thing> {
  constructor(
    protected override store: ThingsStore
  ) {
    super(store);
  }

  selectThings$ = this.selectAll();
  selectCurrentThing$ = this.select('currentThing');
  selectThing(_id: string) { return this.selectEntity(_id)}

}
