import {Deserializable} from "../deserializable/deserializable.model";

export class Source implements Deserializable{
  constructor(
    public name: string = '',
    public url: string = '',
    public price: number = 0,
    public unit: string = '',
  ) {}

  deserialize(input: any): this {
    Object.assign(this as Source, input);
    return this;
  }
}
