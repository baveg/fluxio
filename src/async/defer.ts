import { sleep } from "./sleep"

export const defer = async <T=any>(callback: () => T|Promise<T>): Promise<T> => {
    await sleep(0);
    return await callback();
}