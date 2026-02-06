import type { Dictionary } from '../types/Dictionary';
import { glb } from 'fluxio/glb';

const fluxio: Dictionary<any> = glb.fluxio || (glb.fluxio = {});
const singletons: Dictionary<any> = fluxio.singletons || (fluxio.singletons = {});

export const singleton = <T>(clazz: { prototype: T, name: string }): {
    (): T;
    set(instance: T): void;
    reset(): void;
} => {
  const name = clazz.name;

  const get = () => singletons[name] || (
    singletons[name] = new (clazz as unknown as new () => T)()
  );
  
  get.set = (instance: T) => {
    singletons[name] = instance;
  };

  get.reset = () => {
    singletons[name] = undefined;
  };

  return get;
}