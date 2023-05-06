import {Inject, Injectable} from '@angular/core';
import { ApolloClient , gql } from '@apollo/client';
import {Apollo, APOLLO_OPTIONS} from "apollo-angular";
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Thing} from "../../models/thing/thing.model";
import {Attribute} from "../../models/attribute/attribute.model";
import ObjectID from "bson-objectid";

@Injectable({
  providedIn: 'root',
})
export class StashService {
  constructor(private apollo: Apollo) {}

  getThing(_id: string): Observable<{thing: Thing}> {
    const query = gql`
      query Query($_id: ObjectId!) {
        thing(_id: $_id) {
          _id
          name
          summary
          category
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
            thing {
              _id
              name
            }
            base_quantity
            quantity
          }
        }
      }
    `;

    return this.apollo.watchQuery<{ thing: Thing }>({
      query,
      variables: { _id },
      fetchPolicy: 'network-only', // Always fetch data from the network and not from the cache
    }).valueChanges.pipe(
      map(result => ({ thing: result.data?.thing }))
    );
  }

  getThings(): Observable<{things: Thing[]}> {
    const query = gql`
      query GetThings {
        things {
          _id
          name
          summary
          category
          subcategory
          user
        }
      }
    `;

    return this.apollo.watchQuery<{ things: Thing[] }>({
      query,
    }).valueChanges.pipe(
      map(result => ({ things: result.data?.things }))
    );
  }

  createThing(input: any): Observable<{createThing: Thing}> {
    const mutation = gql`
      mutation CreateThing($input: ThingInput!) {
        createThing(input: $input) {
          _id
          name
          summary
          category
          subcategory
          user
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
        return { createThing: result.data.createThing };
      })
    );
  }


  updateThing(id: string, input: any): Observable<{updateThing: Thing}> {
    const mutation = gql`
      mutation UpdateThing($id: ID!, $input: ThingInput!) {
        updateThing(id: $id, input: $input) {
          _id
          name
          summary
          category
          subcategory
          user
        }
      }
    `;

    return this.apollo.mutate<{ updateThing: Thing }>({
      mutation,
      variables: { id, input },
    }).pipe(
      map(result => {
        if (!result.data?.updateThing) {
          throw new Error("updateThing is undefined");
        }
        return { updateThing: result.data.updateThing };
      })
    );
  }

  createAttribute(thingId: string, input: any): Observable<{ createAttribute: Attribute }> {
    const mutation = gql`
      mutation CreateAttribute($input: AttributeInput, $thingId: ObjectId) {
        createAttribute(input: $input, thingId: $thingId) {
          key
          value
        }
      }
    `;

    return this.apollo.mutate<{ createAttribute: Attribute }>({
      mutation,
      variables: { thingId, input },
    }).pipe(
      map(result => {
        if (!result.data?.createAttribute) {
          throw new Error("createThing is undefined");
        }
        return { createAttribute: result.data.createAttribute };
      })
    );
  }
}
