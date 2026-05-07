export const getTarget = (eventOrTarget: Event | HTMLElement): HTMLElement|undefined => {
    if (eventOrTarget instanceof HTMLElement) return eventOrTarget;
    const el = eventOrTarget.currentTarget ?? eventOrTarget.target;
    if (el instanceof HTMLElement) return el;
    return undefined;
}