import { Injectable} from '@angular/core';
import { gql } from '@apollo/client';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Thing } from "../../models/thing/thing.model";

import {ThingsStore} from "./things.store";

@Injectable({
  providedIn: 'root',
})
export class ThingsApi {
  constructor(private thingsStore: ThingsStore, private apollo: Apollo) {}

  getThing(_id: string): Observable<Thing> {
    const query = gql`
      query Query($_id: ObjectId!) {
        thing(_id: $_id) {
          _id
          name
          summary
          category {
            _id,
            name
          }
          subcategory
          user
          attributes {
            _id
            key
            value
          }
          sources {
            _id
            name
            url
            price
          }
          instances {
            _id
            name
            instance {
              _id
              name
            }
            minimum_quantity
            quantity
          }
        }
      }
    `;

    return this.apollo.watchQuery<{ thing: Thing }>({
      query,
      variables: { _id },
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(
      map(result =>  {
        console.log('fetched thing: ', result.data.thing);
        return result.data.thing
      })
      );
  }

  getThings(): Observable<Thing[]> {
    const query = gql`
      query GetThings {
        things {
          _id
          name
          summary
          category {
            _id,
            name
          }
          subcategory
          user
          attributes {
            _id
            key
            value
          }
          sources {
            _id
            name
            url
            price
          }
          instances {
            _id
            name
            instance {
              _id
              name
            }
            minimum_quantity
            quantity
            transferable
          }
        }
      }
    `;

    return this.apollo.watchQuery<{ things: Thing[] }>({
      query,
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(
      map(result => {
        console.log('fetched things: ', result.data.things);
        return result.data.things
      })
    );
  }

  createThing(input: any): Observable<Thing> {
    const mutation = gql`
      mutation CreateThing($input: ThingInput!) {
        createThing(input: $input) {
          _id
          name
          summary
          category {
            _id,
            name
          }
          subcategory
          user
          attributes {
            _id
            key
            value
          }
          sources {
            _id
            name
            url
            price
          }
          instances {
            _id
            name
            instance {
              _id
              name
            }
            minimum_quantity
            quantity
          }
        }
      }
    `;

    return this.apollo.mutate<{ createThing: Thing }>({
      mutation,
      variables: { input },
    }).pipe(
      map(result => {
        if (!result.data?.createThing) {
          throw new Error("createThing is undefined");
        }
        console.log('created thing: ', result.data.createThing);
        return result.data.createThing ;
      })
    );
  }

  updateThing(thingId: string, input: any): Observable<Thing> {
    const mutation = gql`
      mutation UpdateThing($thingId: ObjectId, $input: ThingInput) {
        updateThing(thingId: $thingId, input: $input) {
          _id
          name
          summary
          category {
            _id,
            name
          }
          subcategory
          user
        }
      }
    `;

    return this.apollo.mutate<{ updateThing: Thing }>({
      mutation,
      variables: { thingId, input },
    }).pipe(
      map(result => {
        if (!result.data?.updateThing) {
          throw new Error("updateThing is undefined");
        }
        console.log('updated thing: ', result.data.updateThing);
        // Update the Thing in the store
        this.thingsStore.upsert(thingId, result.data.updateThing);

        return  result.data.updateThing ;
      })
    );
  }

  deleteThing(_id: string): Observable<string> {
    const mutation = gql`
      mutation DeleteThing($_id: ObjectId) {
        deleteThing(_id: $_id)
      }
    `;

    return this.apollo.mutate<{ deleteThing: string }>({
      mutation,
      variables: { _id },
    }).pipe(
      map(result => {
        if (result.data?.deleteThing === undefined) {
          throw new Error("deleteThing is undefined");
        }
        console.log('deleted thing: ', result.data.deleteThing);
        return result.data.deleteThing;
      })
    );
  }
}
