import { Dictionary } from '../types/Dictionary';
import { req } from './req';
import { ReqOptions } from "./types";
import { getStorage } from '../storage/DataStorage';
import { isFileOrBlob } from '../check/isFileOrBlob';
import { logger } from 'fluxio/logger';

const log = logger('reqCache');

const blobDico: Dictionary<Promise<Blob>> = {};
const urlDico: Dictionary<Promise<string>> = {};

const newReqCache = async (url: string, options: ReqOptions<Blob> = {}) => {
    try {
        log.d('reqCache', url, options);
        
        const storage = getStorage();

        const cached = await storage.get(url);
        if (isFileOrBlob(cached)) return cached;

        const blob = (await req({
            url,
            resType: 'blob',
            ...options
        })) as Blob;
        await storage.set(url, blob);

        log.d('reqCache resolve', url, options, blob);
        
        return blob;
    }
    catch (error) {
        log.w('reqCache error', url, options, error);
        delete blobDico[url];
        throw error;
    }
}

export const reqCache = (url: string, options: ReqOptions<Blob> = {}) => (
    blobDico[url] || (blobDico[url] = newReqCache(url, options))
)

const newReqCacheUrl = async (url: string, options: ReqOptions<Blob> = {}) => {
    try {
        const blobUrl = URL.createObjectURL(await reqCache(url, options));
        log.d('reqCacheUrl', url, options, blobUrl);
        return blobUrl;
    }
    catch (error) {
        log.w('reqCacheUrl error', url, options, error);
        delete urlDico[url];
        throw error;
    }
}

export const reqCacheUrl = (url: string, options: ReqOptions<Blob> = {}) => (
    urlDico[url] || (urlDico[url] = newReqCacheUrl(url, options))
)