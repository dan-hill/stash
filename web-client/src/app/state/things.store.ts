import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Thing } from '../models/thing/thing.model';

export interface ThingsState extends EntityState<Thing> {
  things: Thing[];
  currentThing: Thing | null;

}

export function createInitialState(): ThingsState {
  return {
    things: [],
    currentThing: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'things', idKey: '_id' })
export class ThingsStore extends EntityStore<ThingsState> {
  constructor() {
    super(createInitialState());
  }

  setCurrentThing(thing: Thing) {
    this.update({ currentThing: thing });
  }

  clearCurrentThing() {
    this.update({ currentThing: undefined });
  }


  updateThings(things: Thing[]) {
    this.update({ things: things });
  }
}
