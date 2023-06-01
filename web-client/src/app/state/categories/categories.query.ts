import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {CategoriesState, CategoriesStore} from "./categories.store";
import {Category} from "../../models/category/category.model";

@Injectable({ providedIn: 'root' })
export class CategoriesQuery extends QueryEntity<CategoriesState, Category> {
  constructor(
    protected override store: CategoriesStore) {
    super(store);
  }

  selectCategories$ = this.select('categories');
  selectCurrentCategory$ = this.select('currentCategory');

}
