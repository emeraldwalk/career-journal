export interface Dict<T> {
  [key: string]: T
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Group items in an array by a given key.
 */
export function groupBy<T, K extends keyof T>(
  tags: T[],
  groupKey: K
): Dict<T[]> {
  return tags.reduce((memo, tag) => {
    const groupValue = String(tag[groupKey]);
    const tags = memo[groupValue] || [];
    return {
      ...memo,
      [groupValue]: tags.concat(tag)
    };
  }, {} as Dict<T[]>);
}

/**
 * Get whether this is a new id.
 */
export function isNewId(id: string) {
  return /^-\d+$/.test(id);
}

/**
 * Factory for a predicate that compares a given value
 * against a value in an object.
 */
export function matchKey<T, K extends keyof T>(
  key: K,
  value: T[K]
) {
  return function doMatchKey(
    item: T) {
    return item[key] === value;
  }
}

export function pick<T, K extends keyof T>(
  t: T,
  ...keys: K[]
): Pick<T, K> {
  return keys.reduce((memo, key) => {
    return {
      ...memo,
      [key]: t[key]
    };
  }, {} as Pick<T, K>);
}

/**
 * Get all values from an object into an array.
 */
export function values<T>(
  target: Dict<T>
): Array<T> {
  return Object.keys(target).map(key => target[key]);
}