import { Storage } from './Storage';

let instance: Storage;

export const getStorage = () => instance || (instance = new Storage());

export const setStorage = (next: Storage) => (instance = next);
