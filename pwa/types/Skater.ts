import { Item } from "./item";

export class Skater implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public number?: string,
    public name?: string,
    public jammer?: boolean,
    public pivot?: boolean,
    public team?: string[]
  ) {
    this["@id"] = _id;
  }
}
