import { NotImplemented } from 'fluxio/error';
import type { Dictionary } from '../types/Dictionary';
import { isString } from 'fluxio/check';

type Class<T = any> = (new (...args: any[]) => T) | string;
type Factory<T = any> = () => T;

class IoC {
  private instances: Dictionary<any> = {};
  private factories: Dictionary<Factory> = {};

  /**
   * Register a class or factory in the container
   */
  register<T>(clazz: Class<T>, factory?: Factory<T>): void {
    const key = isString(clazz) ? clazz : clazz.name;
    if (factory) {
      this.factories[key] = factory;
    } else if (!isString(clazz)) {
      this.factories[key] = () => new clazz();
    }
  }

  /**
   * Get or create singleton instance
   */
  get<T>(clazz: Class<T>): T {
    const key = isString(clazz) ? clazz : clazz.name;

    // Return existing instance
    if (this.instances[key]) {
      return this.instances[key];
    }

    // Create new instance
    let factory = this.factories[key];
    if (!factory) {
      if (isString(clazz)) throw new NotImplemented(clazz);
      factory = this.factories[key] = () => new clazz();
    }

    const instance = factory();
    this.instances[key] = instance;
    return instance;
  }

  /**
   * Check if a class is registered
   */
  has<T>(clazz: Class<T>): boolean {
    const key = isString(clazz) ? clazz : clazz.name;
    return !!this.factories[key];
  }

  /**
   * Clear all instances or a specific instance
   */
  clear(clazz?: Class<any>): void {
    const key = isString(clazz) ? clazz : clazz.name;
    if (key) {
      delete this.instances[key];
      return;
    }
    this.instances = {};
  }
}

// Global container instance
export const ioc = new IoC();

/**
 * Register a class or factory in the IoC container
 *
 * @example
 * // Register with auto-instantiation
 * register(ApiService);
 *
 * // Register with custom factory
 * register(ApiService, () => new ApiService(config));
 */
export const register = <T>(clazz: Class<T>, factory?: Factory<T>): void => {
  ioc.register(clazz, factory);
};

/**
 * Get singleton instance from IoC container
 *
 * @example
 * const api = getSingleton(ApiService);
 */
export const getSingleton = <T>(clazz: Class<T>): T => {
  return ioc.get(clazz);
};
