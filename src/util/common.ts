import { Block } from "../types/portable-text";
import { Entry } from "../types/gql-schema";

export interface Dict<T> {
  [key: string]: T
}

/**
 * Extend a type with another.
 * Allows adding properties or changing
 * the type of existing properties with
 * matching keys in the 2nd type.
 */
export type Extend<T, U> = {
  [P in keyof (T & U)]:
    P extends keyof U ? U[P] :
    P extends keyof T ? T[P] :
    never;
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Extract the 2 digit day from an ISO string.
 */
export function dayStr(
  dateStr: string
): string {
  const [, day = ''] = dateStr.match(/^\d{4}-\d{2}-(\d{2})/) || [];
  return day;
}

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

/**
 * Make a shallow copy of an object omitting
 * any given keys.
 */
export function omit<T, K extends keyof T>(
  t: T,
  ...keys: K[]
): Omit<T, K> {
  return Object.keys(t).reduce((memo, key) => {
    if(keys.indexOf(key as K) > -1) {
      return memo;
    }

    return {
      ...memo,
      [key]: t[key as K]
    };
  }, {} as Omit<T, K>);
}

/**
 * Make a shallow copy of a subset of an object
 * base on a given list of keys.
 */
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