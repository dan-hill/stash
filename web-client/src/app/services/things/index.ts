import {ThingsApi} from "./things.api";
import {ThingsQuery} from "./things.query";
import {ThingsStore} from "./things.store";
import {tap} from "rxjs";
import {SourcesApi} from "./sources.api";
import {InstanceApi} from "./instance.api";
import {AttributeApi} from "./attribute.api";

export class ThingsService {
  constructor(
    public thingsApi: ThingsApi,
    private sourcesApi: SourcesApi,
    private instanceApi: InstanceApi,
    private attributeApi: AttributeApi,
    public query: ThingsQuery,
    public store: ThingsStore
  ) {}

  fetchThing(_id: string){
    return this.thingsApi.getThing(_id)
      .pipe(tap(thing => this.store.update(_id, thing)));
  }

  fetchThings(){
    return this.thingsApi.getThings()
      .pipe(tap(things => this.store.add(things)));
  }

  getThing(_id: string) {
    return this.query.selectThing(_id)
  }

  getThings() {
    return this.query.selectThings$;
  }

  createThing(input: any){
    return this.thingsApi.createThing(input)
      .pipe(tap(thing => this.store.add(thing)));
  }

  updateThing(_id: string, input: any) {
    return this.thingsApi.updateThing(_id, input)
      .pipe(tap(thing => this.store.upsert(_id, thing)))
  }

  deleteThing(_id: string) {
    return this.thingsApi.deleteThing(_id)
      .pipe(tap(id => this.store.remove(id)))
  }


  createSource(thingId: string, input: any){
    return this.sourcesApi.createSource(thingId, input)
      .pipe(tap(source => this.fetchThing(thingId)));
  }

  updateSource(thingId: string, _id: string, input: any) {
    return this.sourcesApi.updateSource(_id, input)
      .pipe(tap(source => this.fetchThing(thingId)))
  }

  deleteSource(thingId: string, _id: string) {
    return this.sourcesApi.deleteSource(thingId, _id)
      .pipe(tap(id => this.fetchThing(thingId)))
  }

  createInstance(thingId: string, input: any){
    return this.instanceApi.createInstance(thingId, input)
      .pipe(tap(source => this.fetchThing(thingId)));
  }

  updateInstance(thingId: string, _id: string, input: any) {
    return this.instanceApi.updateInstance(_id, input)
      .pipe(tap(source => this.fetchThing(thingId)))
  }

  deleteInstance(thingId: string, _id: string) {
    return this.instanceApi.deleteInstance(thingId, _id)
      .pipe(tap(id => this.fetchThing(thingId)))
  }

  createAttribute(thingId: string, input: any){
    return this.attributeApi.createAttribute(thingId, input)
      .pipe(tap(source => this.fetchThing(thingId)));
  }

  updateAttribute(thingId: string, _id: string, input: any) {
    return this.attributeApi.updateAttribute(_id, input)
      .pipe(tap(source => this.fetchThing(thingId)))
  }

  deleteAttribute(thingId: string, _id: string) {
    return this.attributeApi.deleteAttribute(thingId, _id)
      .pipe(tap(id => this.fetchThing(thingId)))
  }
}
