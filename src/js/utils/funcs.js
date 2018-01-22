/**
 * Some utils funcs.
 */

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));
export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
export const noop = () => {};
