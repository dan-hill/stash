import { Injectable} from '@angular/core';
import { gql } from '@apollo/client';
import { Apollo } from "apollo-angular";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {Category} from "../../models/category/category.model";
import {CategoryStore} from "./category.store";

@Injectable({
  providedIn: 'root',
})
export class CategoryApi {
  constructor(private categoriesStore: CategoryStore, private apollo: Apollo) {}

  getCategories(): Observable<Category[]> {
    const query = gql`
      query GetCategories {
        categories {
          _id
          name
        }
      }
    `;

    return this.apollo.watchQuery<{ categories: Category[] }>({
      query,
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(

    map(result => {
      this.categoriesStore.update({categories: result.data.categories});
      console.log(result.data.categories)

      return result.data.categories
    })
    );
  }

  getCategory(_id: string): Observable<Category> {
    const query = gql`
      query GetCategory($_id: ObjectId!) {
        category(_id: $_id) {
          _id
          name
        }
      }
    `;

    return this.apollo.watchQuery<{ category: Category }>({
      query,
      variables: { _id },
      fetchPolicy: 'network-only',
    }).valueChanges.pipe(
      map(result => result.data.category)
    );
  }

  createCategory(input: any): Observable<Category> {
    const mutation = gql`
      mutation CreateCategory($input: CategoryInput!) {
        createCategory(input: $input) {
          _id
          name
          children {
            _id
            name
          }
        }
      }
    `;

    return this.apollo.mutate<{ createCategory: Category }>({
      mutation,
      variables: { input },
    }).pipe(
      map(result => {
        if (!result.data?.createCategory) {
          throw new Error("createCategory is undefined");
        }
        console.log('created category:', result.data.createCategory)
        return result.data.createCategory;
      })
    );
  }

  updateCategory(categoryId: string, input: any): Observable<Category> {
    const mutation = gql`
      mutation UpdateCategory($categoryId: ObjectId, $input: CategoryInput) {
        updateCategory(categoryId: $categoryId, input: $input) {
          _id
          name
          children {
            _id
            name
          }
        }
      }
    `;

    return this.apollo.mutate<{ updateCategory: Category }>({
      mutation,
      variables: { categoryId, input },
    }).pipe(
      map(result => {
        if (!result.data?.updateCategory) {
          throw new Error("updateCategory is undefined");
        }
        return  result.data.updateCategory ;
      })
    );
  }

  deleteCategory(_id: string): Observable<string> {
    const mutation = gql`
      mutation DeleteCategory($_id: ObjectId) {
        deleteCategory(_id: $_id)
      }
    `;

    return this.apollo.mutate<{ deleteCategory: string }>({
      mutation,
      variables: { _id },
    }).pipe(
      map(result => {
        if (result.data?.deleteCategory === undefined) {
          throw new Error("deleteCategory is undefined");
        }
        return  result.data.deleteCategory ;
      })
    );
  }

}
