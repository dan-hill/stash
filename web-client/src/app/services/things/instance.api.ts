import { Injectable} from '@angular/core';
import { gql } from '@apollo/client';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Instance } from "../../models/instance/instance.model";

@Injectable({
  providedIn: 'root',
})
export class InstanceApi {
  constructor( private apollo: Apollo) {}

  createInstance(owner: string, input: any): Observable<Instance> {
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
        return result.data.createInstance;
      })
    );
  }

  deleteInstance(instanceId: string, thingId: string): Observable<string> {
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
        return result.data.deleteInstance;
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
