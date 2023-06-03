import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {CategoriesState, CategoryStore} from "./category.store";
import {Category} from "../../models/category/category.model";

@Injectable({ providedIn: 'root' })
export class CategoryQuery extends QueryEntity<CategoriesState, Category> {
  constructor(
    protected override store: CategoryStore) {
    super(store);
  }

  selectCategories$ = this.select('categories');
  selectCurrentCategory$ = this.select('currentCategory');
  selectCategory(_id: string) { return this.selectEntity(_id)}

}
