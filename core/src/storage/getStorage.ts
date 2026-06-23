import { glb } from '../glb';
import { toError } from '../cast/toError';
import { logger } from '../logger/Logger';
import type { Dictionary } from '../types/Dictionary';
import { getKeys } from '../object/getKeys';
import { toVoid } from '../cast/toVoid';
import { toString } from '../cast/toString';
import { jsonParse, jsonStringify } from '../string/json';
import { base64toBlob } from '../string/base64toBlob';
import { isBlob } from '../check/isFileOrBlob';
import { blobToBase64 } from '../string/blobToBase64';
import { resolve } from '../async/resolve';
import { parallel } from '../async';

const log = logger(`Store`);

const DB_STORE = 'data';
export const DEFAULT_STORE = 'default';

export interface DataStore {
  name: string;
  get: <T=unknown>(key: string) => Promise<T>;
  set: <T=unknown>(key: string, value: T) => Promise<void>;
  rm: (key: string) => Promise<void>;
  keys: () => Promise<string[]>;
  clear: () => Promise<void>;
}

export const ramStorage = (name: string, data: Dictionary<any> = {}, r = resolve): DataStore => {
  log.d('ram', name);
  return {
    name,
    get: (key: string) => r(data[key]),
    set: (key: string, value: any) => {
      data[key] = value;
      return r();
    },
    rm: (key: string) => {
      delete data[key];
      return r();
    },
    keys: () => r(getKeys(data)),
    clear: () => {
      for (const k in data) delete data[k];
      return r();
    },
  };
};

export const jsonStorage = (name: string): DataStore | undefined => {
  const s = glb.localStorage;
  if (!s) return;

  log.d('local', name);

  const prefix = `${name}:`;

  const get = (key: string): any => {
    const json = s.getItem(prefix + key);
    const data = json ? jsonParse(json) : undefined;
    if (data && data._type === 'blob') return base64toBlob(data.blob, data.type);
    return resolve(data);
  };

  const set = async (key: string, value: any) => {
    if (isBlob(value)) {
      value = {
        _type: 'blob',
        base64: await blobToBase64(value),
        type: value.type,
      };
    }
    s.setItem(prefix + key, jsonStringify(value));
    return resolve();
  };

  const rm = (key: string) => {
    s.removeItem(prefix + key);
    return resolve();
  };

  const keys = () => {
    const keys: string[] = [];
    for (let i = 0, l = s.length; i < l; i++) {
      const k = s.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    return resolve(keys);
  };

  const clear = () => keys().then(
    ks => parallel(ks.map(k => rm(k))).then(toVoid)
  )

  return { name, get, set, rm, keys, clear };
};

export const dbStorage = async (name: string): Promise<DataStore> => {
  const indexedDB = glb.indexedDB;
  if (!indexedDB) throw toError('no db');;

  log.d('db', name);

  const toPromise = <T>(r: IDBRequest<T> | IDBOpenDBRequest): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      r.onsuccess = () => resolve(r.result as T);
      r.onerror = () => reject(r.error);
    });
  };
  
  let _db: Promise<IDBDatabase>|null = null;
  const openDb = async (recreate = false) => {
    if (!_db || recreate) {
      const openRequest = indexedDB.open(name, 1);
      openRequest.onupgradeneeded = () => {
        openRequest.result.createObjectStore(DB_STORE);
      };
      _db = toPromise(openRequest);
    }
    return _db;
  };

  const action = async <T>(name: String, key: String, cb: (store: IDBObjectStore) => IDBRequest<T>, isReadonly = false) => {
    let err;
    for (let i=0; i<3; i++) {
      try {
        log.d(name, key);
        const db = await openDb(i > 0);
        const store = db
          .transaction(DB_STORE, isReadonly ? 'readonly' : 'readwrite')
          .objectStore(DB_STORE);
        return await toPromise(cb(store));
      }
      catch (e) {
        err = e;
        log.w(name, key, e);
      }
    }
    throw err;
  }

  const get = (key: string) => action('get', key, s => s.get(key), true);
  const set = (key: string, value: any) => action('set', key, s => s.put(value, key)).then(toVoid);
  const rm = (key: string) => action('delete', key, s => s.delete(key));
  const keys = () => action('keys', '', s => s.getAllKeys(), true).then((k) => k.map(toString));
  const clear = () => action('clear', '', s => s.clear(), true);

  await set('__', { ok: 1 });
  const test = await get('__');
  if (test.ok !== 1) throw toError('db not ok');
  await rm('__');

  return {
    name,
    get,
    set,
    rm,
    keys,
    clear,
  };
};

export const newStorage = (name: string): DataStore => {
  log.d('new', name);
  const p = dbStorage(name).catch(() => jsonStorage(name) || ramStorage(name));
  return {
    name,
    get: (key: string) => p.then(s => s.get(key)),
    set: (key: string, value: any) => p.then(s => s.set(key, value)),
    rm: (key: string) => p.then(s => s.rm(key)),
    keys: () => p.then(s => s.keys()),
    clear: () => p.then(s => s.clear()),
  };
};

export const storageByName: Dictionary<DataStore> = {};
export const getStorage = (name: string = DEFAULT_STORE): DataStore => (
  storageByName[name] || (storageByName[name] = newStorage(name))
);