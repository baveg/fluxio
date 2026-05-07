export const getTarget = (e: HTMLInputElement | Event): HTMLElement|undefined => (
    e instanceof HTMLElement ? e : (e.target ?? e.currentTarget) as HTMLElement
);