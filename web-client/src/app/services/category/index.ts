import {CategoryApi} from "./category.api";
import {CategoryQuery} from "./category.query";
import {CategoryStore} from "./category.store";
import {tap} from "rxjs";

export class CategoryService {
  constructor(
    public categoryApi: CategoryApi,
    public query: CategoryQuery,
    public store: CategoryStore
  ) {}

  fetchCategory(_id: string){
    return this.categoryApi.getCategory(_id)
      .pipe(tap(category => this.store.update(_id, category)));
  }

  fetchCategories(){
    return this.categoryApi.getCategories()
      .pipe(tap(categories => this.store.add(categories)));
  }

  getCategory(_id: string) {
    return this.query.selectCategory(_id)
  }

  getCategories() {
    return this.query.selectCategories$;
  }

  createCategory(input: any){
    return this.categoryApi.createCategory(input)
      .pipe(tap(category => this.store.add(category)));
  }

  updateCategory(_id: string, input: any) {
    return this.categoryApi.updateCategory(_id, input)
      .pipe(tap(category => this.store.upsert(_id, category)))
  }

  deleteCategory(_id: string) {
    return this.categoryApi.deleteCategory(_id)
      .pipe(tap(id => this.store.remove(id)))
  }

}
