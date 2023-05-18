import {Deserializable} from "../deserializable/deserializable.model";
import {Thing} from "../thing/thing.model";

export class Instance implements Deserializable{
  constructor(
    public _id: string = '',
    public name: string = '',
    public thing: Thing = new Thing(),
    public base_quantity: number = 0,
    public quantity: number = 0,
  ) {}

  deserialize(input: any): this {
    Object.assign(this as Instance, input);
    return this;
  }
}
