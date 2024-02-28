import { Item } from "./item";

export class Team implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public color?: string,
    public skaters?: string[]
  ) {
    this["@id"] = _id;
  }
}
