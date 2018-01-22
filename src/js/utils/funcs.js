/**
 * Some utils funcs.
 */

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));
export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
export const noop = () => {};

/**
 * Returns an alphabetical sort function based on the predicate.
 * @param  {String} predicate - The key name.
 * @return {Function}         - The sort function.
 */
export const sortByPredicate = (predicate) => (a, b) => {
  const A = a[predicate].toUpperCase();
  const B = b[predicate].toUpperCase();
  if (A < B) return -1;
  if (A > B) return 1;
  return 0;
};

/**
 * Returns the next item, will loop if at end.
 * @param  {Array}    array - The array to get from.
 * @param  {Object} current - The current item.
 * @return {String}         - The next item from the array.
 */
export const getNextFromArray = (array, current) => {
  const index = array.indexOf(current) + 1;
  return index > array.length - 1 ? array[0] : array[index];
};
