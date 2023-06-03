import { Injectable} from '@angular/core';
import { gql } from '@apollo/client';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Source} from "../../models/source/source.model";

@Injectable({
  providedIn: 'root',
})
export class SourcesApi {
  constructor(private apollo: Apollo) {}

  createSource(thingId: string, input: any): Observable<Source> {
    const mutation = gql`
      mutation CreateSource($thingId: ObjectId, $input: SourceInput!) {
        createSource(thingId: $thingId, input: $input) {
          _id
          name
          price
          url
        }
      }
    `;

    return this.apollo.mutate<{ createSource: Source }>({
      mutation,
      variables: { thingId, input },
    }).pipe(
      map(result => {
        if (!result.data?.createSource) {
          throw new Error("createSource is undefined");
        }
        return result.data.createSource;
      })
    );
  }

  deleteSource(thingId: string, sourceId: string): Observable<string> {
    const mutation = gql`
      mutation DeleteSource($sourceId: ObjectId, $thingId: ObjectId) {
        deleteSource(sourceId: $sourceId, thingId: $thingId)
      }
    `;

    return this.apollo.mutate<{ deleteSource: string }>({
      mutation,
      variables: { sourceId, thingId },
    }).pipe(
      map(result => {
        if (result.data?.deleteSource === undefined) {
          throw new Error("deleteSource is undefined");
        }
        return result.data.deleteSource;
      })
    );
  }
  updateSource(sourceId: string, input: any): Observable<Source> {
    const mutation = gql`
      mutation UpdateSource($sourceId: ObjectId, $input: SourceInput!) {
        updateSource(sourceId: $sourceId, input: $input) {
          _id
          name
          price
          url
        }
      }
    `;

    return this.apollo.mutate<{ updateSource: Source }>({
      mutation,
      variables: { sourceId, input },
    }).pipe(
      map(result => {
        if (!result.data?.updateSource) {
          throw new Error("updateSource is undefined");
        }
        return  result.data.updateSource;
      })
    );
  }


}
