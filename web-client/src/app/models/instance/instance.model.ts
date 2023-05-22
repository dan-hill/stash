import {Deserializable} from "../deserializable/deserializable.model";
import {Thing} from "../thing/thing.model";

export class Instance implements Deserializable{
  constructor(
    public _id: string = '',
    public name: string = '',
    public instance: Instance | null = null,
    public minimum_quantity: number = 0,
    public quantity: number = 0,
    public transferable: boolean = false,
  ) {}

  deserialize(input: any): this {
    Object.assign(this as Instance, input);
    return this;
  }
}
