import { addCssFile } from 'fluxio';

export const addFont = (name: string) =>
  addCssFile(`https://fonts.googleapis.com/css2?family=${name}&display=swap`);
