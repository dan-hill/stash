import {Deserializable} from "../deserializable/deserializable.model";
import {Instance} from "../instance/instance.model";
import {Source} from "../source/source.model";
import {Attribute} from "../attribute/attribute.model";

export class Thing implements Deserializable{
  constructor(
    public _id: string = '',
    public name: string = '',
    public summary: string = '',
    public category: string = '',
    public subcategory: string = '',
    public user: string = '',
    public attributes: Attribute[] = [],
    public instances: Instance[] = [],
    public sources: Source[] = [],
  ) {}
  static fromObject(input: {
    _id: string;
    name: string;
    summary: string;
    category: string;
    subcategory: string;
    user: string;
    attributes: Attribute[];
    instances: Instance[];
    sources: Source[];
  }): Thing {
    return new Thing(
      input._id,
      input.name,
      input.summary,
      input.category,
      input.subcategory,
      input.user,
      input.attributes,
      input.instances,
      input.sources
    );
  }
  deserialize(input: any): this {
    Object.assign(this as Thing, input);
    return this;
  }
}
