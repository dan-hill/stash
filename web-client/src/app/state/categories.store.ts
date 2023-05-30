import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Category } from "../models/category/category.model";

export interface CategoriesState extends EntityState<Category> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'categories', idKey: '_id' })
export class CategoriesStore extends EntityStore<CategoriesState, Category> {
  constructor() {
    super();
  }

  setCurrentCategory(category: Category) {
    this.setActive(category._id);
  }

  clearCurrentCategory() {
    this.setActive(null);
  }

  addCategories(categories: Category[]) {
    this.add(categories);
  }

  updateCategory(category: Category) {
    this.update(category._id, category);
  }

  deleteCategory(_id: string) {
    this.remove(_id);
  }
}
