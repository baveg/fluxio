import { pipe } from "../flux/Flux";
import { glb } from "../glb";
import { onEvent } from "../html/onEvent";

const nav = glb.navigator;

// Polyfill pour navigateurs anciens sans navigator.onLine
const getOnLineStatus = (): boolean => {
  if (typeof nav !== 'undefined' && 'onLine' in nav) {
    return nav.onLine;
  }
  // Fallback : assume online si pas de support
  return true;
};

export const isOnLine$ = pipe<boolean>(
  (listener) => {
    const update = () => {
      isOnLine$.set(getOnLineStatus());
      listener();
    };
    const off1 = onEvent(glb, 'online', update);
    const off2 = onEvent(glb, 'offline', update);
    return () => {
      off1();
      off2();
    };
  },
  (pipe) => {
    pipe.set(getOnLineStatus());
  },
  undefined
);