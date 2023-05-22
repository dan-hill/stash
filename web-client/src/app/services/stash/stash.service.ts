import {Inject, Injectable} from '@angular/core';
import { ApolloClient , gql } from '@apollo/client';
import {Apollo, APOLLO_OPTIONS} from "apollo-angular";
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Thing} from "../../models/thing/thing.model";
import {Attribute} from "../../models/attribute/attribute.model";
import ObjectID from "bson-objectid";
import {Instance} from "../../models/instance/instance.model";

@Injectable({
  providedIn: 'root',
})
export class StashService {
  constructor(private apollo: Apollo) {}

  getThing(_id: string): Observable<Thing> {
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
      map(result =>  result.data.thing)
      );
  }

  getThings(): Observable<Thing[]> {
    const query = gql`
      query GetThings {
        things {
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
        console.log(result);
        return result.data.things
      })
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
        console.log(result)
        if (!result.data?.createThing) {
          throw new Error("createThing is undefined");
        }
        return { createThing: result.data.createThing };
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

  updateAttribute(attributeId: string, input: any): Observable<{ updateAttribute: Attribute }> {
    const mutation = gql`
      mutation UpdateAttribute($attributeId: ObjectId, $input: AttributeInput) {
        updateAttribute(attributeId: $attributeId, input: $input) {
          key
          value
        }
      }
    `;

    return this.apollo.mutate<{ updateAttribute: Attribute }>({
      mutation,
      variables: { attributeId, input },
    }).pipe(
      map(result => {
        if (!result.data?.updateAttribute) {
          throw new Error("updateAttribute is undefined");
        }
        return { updateAttribute: result.data.updateAttribute };
      })
    );
  }

  deleteAttribute(attributeId: string, thingId: string): Observable<{ deleteAttribute: string }> {
    const mutation = gql`
      mutation DeleteAttribute($attributeId: ObjectId, $thingId: ObjectId) {
        deleteAttribute(attributeId: $attributeId, thingId: $thingId)
      }
    `;

    return this.apollo.mutate<{ deleteAttribute: string }>({
      mutation,
      variables: { attributeId, thingId },
    }).pipe(
      map(result => {
        if (result.data?.deleteAttribute === undefined) {
          throw new Error("deleteAttribute is undefined");
        }
        return { deleteAttribute: result.data.deleteAttribute };
      })
    );
  }
  createInstance(owner: string, input: any): Observable<{ createInstance: Instance }> {
    const mutation = gql`
      mutation CreateInstance($owner: ObjectId, $input: InstanceInput!) {
        createInstance(owner: $owner, input: $input) {
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
    `;

    return this.apollo.mutate<{ createInstance: Instance }>({
      mutation,
      variables: { owner, input },
    }).pipe(
      map(result => {
        if (!result.data?.createInstance) {
          throw new Error("createInstance is undefined");
        }
        return { createInstance: result.data.createInstance };
      })
    );
  }

  deleteInstance(instanceId: string, thingId: string): Observable<{ deleteInstance: string }> {
    const mutation = gql`
      mutation DeleteInstance($instanceId: ObjectId, $thingId: ObjectId) {
        deleteInstance(instanceId: $instanceId, thingId: $thingId)
      }
    `;

    return this.apollo.mutate<{ deleteInstance: string }>({
      mutation,
      variables: { instanceId, thingId },
    }).pipe(
      map(result => {
        if (result.data?.deleteInstance === undefined) {
          throw new Error("deleteInstance is undefined");
        }
        return { deleteInstance: result.data.deleteInstance };
      })
    );
  }
  updateInstance(_id: string, input: any): Observable<Instance> {
    const mutation = gql`
      mutation UpdateInstance($_id: ObjectId, $input: InstanceInput!) {
        updateInstance(_id: $_id, input: $input) {
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
    `;

    return this.apollo.mutate<{ updateInstance: Instance }>({
      mutation,
      variables: { _id, input },
    }).pipe(
      map(result => {
        if (!result.data?.updateInstance) {
          throw new Error("updateInstance is undefined");
        }
        return  result.data.updateInstance;
      })
    );
  }
}
