import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Thing } from '../../models/thing/thing.model';

export interface ThingsState extends EntityState<Thing> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'things', idKey: '_id' })
export class ThingsStore extends EntityStore<ThingsState, Thing> {
  constructor() {
    super();
  }

}
