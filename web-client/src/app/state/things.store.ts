import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Thing } from '../models/thing/thing.model';

export interface ThingsState extends EntityState<Thing> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'things', idKey: '_id' })
export class ThingsStore extends EntityStore<ThingsState, Thing> {
  constructor() {
    super();
  }

  setCurrentThing(thing: Thing) {
    this.setActive(thing._id);
  }

  clearCurrentThing() {
    this.setActive(null);
  }

  addThings(things: Thing[]) {
    this.add(things);
  }

  updateThing(thing: Thing) {
    this.update(thing._id, thing);
  }

  deleteThing(_id: string) {
    this.remove(_id);
  }
}
