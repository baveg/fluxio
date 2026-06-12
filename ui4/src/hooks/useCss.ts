import { setCss } from '@fluxio/core/html';
import { uuid } from '@fluxio/core/string';
import { useEffect } from 'preact/hooks';
import { useConstant } from './useConstant';
import { isFunction } from '@fluxio/core/check';

export const useCss = (css: string | (() => string), deps?: any[]) => {
  const key = useConstant(uuid);
  useEffect(
    () => {
      setCss(key, isFunction(css) ? css() : css);
      return () => {
        setCss(key, null);
      };
    },
    deps || [css]
  );
};
