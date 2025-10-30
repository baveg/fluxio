import { glb } from '../glb';
import { req } from './req';
import { ReqOptions } from './types';

export const getCache = async (): Promise<Cache | undefined> => {
  return await glb.caches?.open('fluxio-blobs');
};

export const reqBlob = async (url: string, isCached = true, options: ReqOptions<Blob> = {}) => {
  const cache = isCached && (await getCache());

  if (cache) {
    const cached = await cache.match(url);
    if (cached) {
      return await cached.blob();
    }
  }

  const blob = (await req({ url, resType: 'blob', ...options })) as Blob;

  if (cache) {
    const response = new Response(blob, {
      headers: {
        'Content-Type': blob.type,
        date: new Date().toUTCString(),
      },
    });
    await cache.put(url, response);
  }

  return blob;
};
