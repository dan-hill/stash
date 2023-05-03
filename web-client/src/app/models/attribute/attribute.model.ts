import {Deserializable} from "../deserializable/deserializable.model";

export class Attribute implements Deserializable{
  constructor(
    public _id: string = '',
    public key: string = '',
    public value: string = '',
  ) {}

  deserialize(input: any): this {
    Object.assign(this as Attribute, input);
    return this;
  }
}
