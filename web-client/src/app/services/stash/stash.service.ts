import {Inject, Injectable} from '@angular/core';
import { ApolloClient , gql } from '@apollo/client';
import {Apollo, APOLLO_OPTIONS} from "apollo-angular";

@Injectable({
  providedIn: 'root',
})
export class StashService {
  constructor(private apollo: Apollo) {}

  getThing(id: string) {
    const query = gql`
      query Query($id: ID!) {
        thing(id: $id) {
          _id
          name
          summary
          category
          subcategory
          user
          attributes {
            key
            value
          }
          sources {
            name
            url
            price
          }
          instances {
            thing {
              name
              _id
            }
            base_quantity
            quantity
          }
        }
      }
    `;

    return this.apollo.watchQuery<{ thing: any }>({
      query,
      variables: { id },
    }).valueChanges;
  }

  getThings() {
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

    return this.apollo.watchQuery<{ things: any[] }>({
      query,
    }).valueChanges;
  }

  createThing(input: any) {
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

    return this.apollo.mutate<{ createThing: any }>({
      mutation,
      variables: { input },
    });
  }

  updateThing(id: string, input: any) {
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

    return this.apollo.mutate<{ updateThing: any }>({
      mutation,
      variables: { id, input },
    });
  }

  deleteThing(id: string) {
    const mutation = gql`
      mutation DeleteThing($id: ID!) {
        deleteThing(id: $id) {
          _id
          name
          summary
          category
          subcategory
          user
        }
      }
    `;

    return this.apollo.mutate<{ deleteThing: any }>({
      mutation,
      variables: { id },
    });
  }
}
