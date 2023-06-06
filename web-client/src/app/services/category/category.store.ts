import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Category } from "../../models/category/category.model";

export interface CategoriesState extends EntityState<Category> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'categories', idKey: '_id' })
export class CategoryStore extends EntityStore<CategoriesState, Category> {
  constructor() {
    super();
  }

}
