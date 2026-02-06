import { ioc } from '../../object/ioc';
import { useMemo } from 'preact/hooks';

type Class<T = any> = new (...args: any[]) => T;

/**
 * Hook to get singleton instance from IoC container
 * Returns stable reference across renders
 *
 * @example
 * const deviceCtrl = useSingleton(Kiosk);
 */
export const useSingleton = <T>(clazz: Class<T>): T => {
  return useMemo(() => ioc.get(clazz), [clazz]);
};
