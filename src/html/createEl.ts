import { glb } from '../glb';

export const createEl: typeof glb.document.createElement = (
  tagName: string,
  options?: ElementCreationOptions
) => glb.document.createElement(tagName, options);
