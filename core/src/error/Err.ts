import { isItem } from "../check";

export class Err extends Error {
  constructor(public data: any, message?: string, name?: string) {
    super(message || isItem(data) ? data.message : String(data));
    this.name = name || isItem(data) ? data.name : 'Err';
  }
}
