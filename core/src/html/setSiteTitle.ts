import { glb } from '../glb';

export const setSiteTitle = (title: string) => {
  const titleEl = glb.document.getElementsByTagName('title')[0];
  if (titleEl) titleEl.innerText = title;
  glb.document.title = title;
};
