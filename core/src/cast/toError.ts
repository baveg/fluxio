import { Err } from "../error/Err";

export const toError = (data: any, message?: string, name?: string) =>
  data instanceof Error ? data : new Err(message, data, name);
