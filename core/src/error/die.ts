import { toError } from "../cast/toError";

/**
 * Throws the given value as an `Error`, converting it first if necessary.
 *
 * Useful in expression position (e.g. `x ?? die("missing x")`) where a
 * `throw` statement isn't allowed.
 *
 * @param error - The value to throw; non-`Error` values are converted via {@link toError}.
 * @returns Never returns.
 *
 * @example
 * const x = value ?? die("value is required")
 */
export const die = (error: any, message?: string, name?: string): never => {
    throw toError(error, message, name);
}