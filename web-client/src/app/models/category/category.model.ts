import {Deserializable} from "../deserializable/deserializable.model";

export class Category implements Deserializable {
  constructor(
    public _id: string = '',
    public name: string = '',
    public children: Category[] = [],
  ) {}

  static fromObject(input: {
    _id: string;
    name: string;
    children: any[]; // Here the input type is changed to any because we need to recursively convert children to Category
  }): Category {
    return new Category(
      input._id,
      input.name,
      input.children ? input.children.map(child => Category.fromObject(child)) : [] // recursively convert children to Category
    );
  }

  deserialize(input: any): this {
    this._id = input._id;
    this.name = input.name;
    this.children = input.children ? input.children.map((child: any) => new Category().deserialize(child)) : []; // recursively deserialize children
    return this;
  }
}
