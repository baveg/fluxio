import { useEffect, useState } from 'preact/hooks';
import { setUrlParams } from '@fluxio/core/url/setUrlParams';
import { ElProps } from './types';
import { isBoolean } from '@fluxio/core/check';
import { isOnLine$ } from '@fluxio/core/url';
import { useFlux } from '../hooks';

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
  const [loaded, setLoaded] = useState('');
  const isOnLine = useFlux(isOnLine$);

  useEffect(() => {
    if (!cachedUrl || !isOnLine || loaded === cachedUrl) return;

    const img = new window.Image();
    img.src = cachedUrl;
    img.onload = () => setLoaded(cachedUrl);
  }, [cachedUrl, isOnLine, loaded]);

  return (
    <img
      {...props}
      src={loaded || cachedThumbUrl || src}
      loading={loading}
      decoding={decoding}
      alt={alt}
      aria-hidden={!alt}
    />
  );
};
