import {Deserializable} from "../deserializable/deserializable.model";

export class User implements Deserializable {
  constructor(
    public _id: string = '',
    public email: string = '',
  ) {}
  static fromObject(input: {
    _id: string;
    email: string;
  }): User {
    return new User(
      input._id,
      input.email,
    );
  }
  deserialize(input: any): this {
    Object.assign(this as User, input);
    return this;
  }
}
