import { glb } from '../glb';
import { toError } from '../cast/toError';
import { logger } from '../logger/Logger';
import { Dictionary } from '../types/Dictionary';
import { singleton } from '../object';
import { toVoid } from '../cast/toVoid';
import { toString } from '../cast/toString';
import { jsonParse, jsonStringify } from '../string/json';
import { base64toBlob } from '../string/base64toBlob';
import { isBlob } from '../check/isFileOrBlob';
import { blobToBase64 } from '../string/blobToBase64';

export interface InternalStorage {
  name: string;
  get: (key: string) => any|Promise<any>;
  set: (key: string, value: any) => void|Promise<void>;
  rm: (key: string) => void|Promise<void>;
  keys: () => string[]|Promise<string[]>;
  clear?: () => void|Promise<void>;
}

export const ramStore = (name: string): InternalStorage => {
  const dico: Dictionary<any> = {};
  return {
    name,
    get: (key: string) => dico[key],
    set: (key: string, value: any) => {
      dico[key] = value
    },
    rm: (key: string) => {
      delete dico[key];
    },
    keys: () => Object.keys(dico),
    clear: () => {
      for (const k in dico) delete dico[k];
    }
  }
}

export const dbStore = async (name: string): Promise<InternalStorage|undefined> => {
  const indexedDB = glb.indexedDB;
  if (!indexedDB) return;

  const STORE = 'data';

  const toPromise = <T>(r: IDBRequest<T>|IDBOpenDBRequest): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      r.onsuccess = () => resolve(r.result as T);
      r.onerror = () => reject(r.error);
    });
  }

  const openRequest = indexedDB.open(name, 1);
  openRequest.onupgradeneeded = () => {
    openRequest.result.createObjectStore(STORE);
  };

  // TODO :
  // 1) Es-ce un problème de laisser la db en reférence ?
  //    Ou faut t'il constament l'open à chaque appel
  const db = await toPromise(openRequest);

  const getStore = (isReadonly = false) => (
    db.transaction(STORE, isReadonly ? 'readonly' : 'readwrite').objectStore(STORE)
  );

  const get = (key: string) => (
    toPromise(getStore(true).get(key))
  );
  const set = (key: string, value: any) => (
    toPromise(getStore().put(value, key)).then(toVoid)
  );
  const rm = (key: string) => (
    toPromise(getStore().delete(key))
  );
  const keys = () => (
    toPromise(getStore(true).getAllKeys()).then(k => k.map(toString))
  );
  const clear = () => (
    toPromise(getStore(true).clear())
  );

  // check db ok
  await set('__', { ok: 1 });
  const test = await get('__');
  if (test.ok !== 1) throw toError('no dbStorage get set');
  await rm('__');

  return {
    name,
    get,
    set,
    rm,
    keys,
    clear,
  }
}

export const jsonStore = async (name: string): Promise<InternalStorage|undefined> => {
  const s = glb.localStorage;
  if (!s) return;

  const prefix = `${name}:`;

  const get = (key: string): any => {
    const json = s.getItem(prefix+key);
    const data = json ? jsonParse(json) : undefined;
    if (data && data._type === 'blob') return base64toBlob(data.blob, data.type);
    return data;
  };

  const set = async (key: string, value: any) => {
    if (isBlob(value)) {
      value = {
        _type: 'blob',
        base64: await blobToBase64(value),
        type: value.type,
      };
    }
    s.setItem(prefix+key, jsonStringify(value));
  };

  const rm = (key: string) => {
    s.removeItem(prefix+key);
  };

  const keys = () => {
    const keys: string[] = [];
    for (let i=0,l=s.length; i<l; i++) {
      const k = s.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    return keys;
  };

  return { name, get, set, rm, keys };
}

export class DataStorage {
  log = logger(`DataStorage:${this.name}`);

  static get = singleton(DataStorage);
  private constructor(public name: string = 'default') {}

  async newStore(): Promise<InternalStorage> {
    const name = this.name;

    try {
      const s1 = await dbStore(name);
      if (s1) return s1;
    }
    catch (error) {
      this.log.w('dbStore', error);
    }

    try {
      const s2 = await jsonStore(name);
      if (s2) return s2;
    }
    catch (error) {
      this.log.w('jsonStore', error);
    }

    return ramStore(name);
  }

  _store?: Promise<InternalStorage>;
  getStore(): Promise<InternalStorage> {
    return this._store || (this._store = this.newStore());
  }

  async get<T = any>(key: string): Promise<T> {
    if (!key) throw toError('no key');
    const store = await this.getStore();
    return await store.get(key);
  }

  async set<T = any>(key: string, value?: T) {
    if (!key) throw toError('no key');
    const store = await this.getStore();
    await store.set(key, value);
  }

  async rm(key: string) {
    if (!key) throw toError('no key');
    const store = await this.getStore();
    await store.rm(key);
  }

  async clear() {
    const store = await this.getStore();
    if (store.clear) {
      await store.clear();
    } else {
      const keys = await store.keys();
      for (const key of keys) {
        await store.rm(key);
      }
    }
  }
}

export const getStorage = DataStorage.get;
