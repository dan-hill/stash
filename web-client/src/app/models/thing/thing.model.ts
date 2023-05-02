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

  deserialize(input: any): this {
    Object.assign(this as Thing, input);
    return this;
  }
}
