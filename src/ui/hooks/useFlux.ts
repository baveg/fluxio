import { Inputs, useEffect, useMemo, useState } from 'preact/hooks';
import { FluxDictionary } from '../../flux/fluxDictionary';
import { Flux, isFlux } from '../../flux/Flux';

type NFlux<T> = Flux<T> | string | number | boolean | false | null | undefined;
type NFluxDictionary<T> = FluxDictionary<T> | null | undefined;

interface UseFlux {
  <T = any>(flux: Flux<T>): T;
  <T = any>(flux: NFlux<T>): T | undefined;
}
export const useFlux = (<T = any>(flux: NFlux<T>): T | undefined => {
  const [state, setState] = useState(isFlux(flux) ? flux.get() : undefined);
  useEffect(() => {
    if (!isFlux(flux)) {
      setState(undefined);
      return;
    }
    const off = flux.on((v) => setState(v));
    setState(flux.get());
    return off;
  }, [flux]);
  return state;
}) as UseFlux;

interface UseFluxState {
  <T = any>(flux: Flux<T>): [T, (next: T) => void];
  <T = any>(flux: NFlux<T>): [T | undefined, (next: T) => void];
}
export const useFluxState = (<T = any>(flux: Flux<T>): [T, (next: T) => void] => {
  const [state, setState] = useState(flux && flux.get());
  useEffect(() => {
    const off = flux && flux.on(setState);
    setState(flux && flux.get());
    return off || undefined;
  }, [flux]);
  return [state, (next) => flux && flux.set(next)];
}) as UseFluxState;

export const useFluxItem = <T = any>(
  flux: NFluxDictionary<T>,
  key: string
): [T | undefined, (next: T) => void] => {
  const [state, setState] = useState(flux ? flux.getItem(key) : undefined);
  useEffect(() => {
    setState(flux ? flux.getItem(key) : undefined);
    if (flux) {
      return flux.on(() => {
        setState(flux && flux.getItem(key));
      });
    }
    return;
  }, [flux, key]);
  return [state, (next) => flux && flux.setItem(key, next)];
};

export const useFluxMemo = <T = any>(factory: () => NFlux<T>, inputs: Inputs = []) =>
  useFlux(useMemo(factory, inputs));
