/**
 * Remove a given item from an array.
 */
export function remove<T>(
  array: T[],
  item: T,
  match = (i: T) => i === item,
): T[] {
  const i = array.findIndex(match);
  return [
    ...array.slice(0, i),
    ...array.slice(i + 1)
  ];
}

/**
 * Insert a given item into an array.
 * If match is found replace it, otherwise
 * append it.
 */
export function set<T>(
  array: T[],
  item: T,
  match = (i: T) => i === item,
): T[] {
  const i = array.findIndex(match);
  return i > -1
    ? [
      ...array.slice(0, i),
      item,
      ...array.slice(i + 1)
    ]
    : [
      ...array,
      item
    ];
}