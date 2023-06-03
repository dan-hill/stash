import { Injectable} from '@angular/core';
import { gql } from '@apollo/client';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Attribute } from "../../models/attribute/attribute.model";


@Injectable({
  providedIn: 'root',
})
export class AttributeApi {
  constructor( private apollo: Apollo) {}

  createAttribute(thingId: string, input: any): Observable<Attribute> {
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
        return result.data.createAttribute;
      })
    );
  }

  updateAttribute(attributeId: string, input: any): Observable<Attribute> {
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
        return result.data.updateAttribute;
      })
    );
  }

  deleteAttribute(attributeId: string, thingId: string): Observable<string> {
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
        return result.data.deleteAttribute;
      })
    );
  }


}
