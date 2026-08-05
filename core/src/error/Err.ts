import { isItem } from "../check";

const _message = (data: any) => String(
  isItem(data) ? data.message || data.msg || data.title || data.detail || '' : data
);

export class Err extends Error {
  constructor(public data: any, message?: string, name?: string) {
    super(message || _message(data));
    this.name = name || 'Err'
  }
}
