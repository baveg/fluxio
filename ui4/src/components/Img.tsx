import { useEffect, useState, useRef } from 'preact/hooks';
import { setUrlParams } from '@fluxio/core/url/setUrlParams';
import { ElProps } from './types';
import { isBoolean } from '@fluxio/core/check';
import { isOnLine$ } from '@fluxio/core/url';
import { useFlux, useIsVisible } from '../hooks';

export type ImgProps = ElProps['img'] & {
  thumbUrl?: string;
  thumbCached?: boolean;
  url?: string;
  cached?: boolean | number;
}

const withCached = (url: string | undefined, cached: boolean | number) => (
  (url && cached) ? setUrlParams(url, {
    cached: isBoolean(cached) ? (cached ? 1 : 0) : cached
  }) : url
);

export const Img = ({
  thumbUrl,
  thumbCached,
  url,
  src,
  cached = false,
  loading = 'lazy',
  decoding = 'async',
  alt,
  ...props
}: ImgProps) => {
  const cachedThumbUrl = withCached(thumbUrl || url, thumbCached === false ? false : (thumbCached || cached));
  const cachedUrl = withCached(url, cached);
  const [currentSrc, setCurrentSrc] = useState(cachedThumbUrl || src);
  const imgRef = useRef<HTMLImageElement>(null);
  const isVisible = useIsVisible(imgRef);
  const isOnLine = useFlux(isOnLine$);

  // Préchargement du thumb immédiatement
  useEffect(() => {
    if (!cachedThumbUrl || !isOnLine) return;

    const img = new window.Image();
    img.src = cachedThumbUrl;
    img.onload = () => setCurrentSrc(cachedThumbUrl);
  }, [cachedThumbUrl, isOnLine]);

  // Chargement de l'image HD quand visible
  useEffect(() => {
    if (!cachedUrl || !isOnLine || !isVisible || currentSrc === cachedUrl) return;

    const img = new window.Image();
    img.src = cachedUrl;
    img.onload = () => setCurrentSrc(cachedUrl);
  }, [cachedUrl, isOnLine, isVisible, currentSrc]);

  console.debug('render', { isVisible, isOnLine, cachedThumbUrl, cachedUrl, src, currentSrc })

  return (
    <img
      {...props}
      ref={imgRef}
      src={currentSrc}
      loading={loading}
      decoding={decoding}
      alt={alt}
      aria-hidden={!alt}
    />
  );
};
