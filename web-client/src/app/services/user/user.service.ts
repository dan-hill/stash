import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../../models/user/user.model";
import {gql} from "@apollo/client";
import {map} from "rxjs/operators";
import {Apollo} from "apollo-angular";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apollo: Apollo) { }

  getMe(): Observable<User> {
    const query = gql`
      query Query {
        me {
          _id
          email
        }
      }
    `;

    return this.apollo.watchQuery<any>({
      query,
      fetchPolicy: 'network-only', // Always fetch data from the network and not from the cache
    }).valueChanges.pipe(
      map(result => result.data.me)
    );
  }
}
