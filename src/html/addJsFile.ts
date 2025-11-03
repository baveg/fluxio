import { Dictionary } from '../check/isDictionary';
import { createEl } from './createEl';
import { waitScriptLoaded } from './waitScriptLoaded';

const _jsFiles: Dictionary<HTMLScriptElement> = {};

export const addJsFile = (url: string): HTMLScriptElement => {
  if (_jsFiles[url]) return _jsFiles[url];
  const el = createEl('script');
  el.type = 'text/javascript';
  el.async = true;
  el.src = url;
  _jsFiles[url] = document.head.appendChild(el);
  return el;
};

export const addJsFileAsync = (url: string) => waitScriptLoaded(addJsFile(url));
