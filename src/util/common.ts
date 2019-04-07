export interface Dict<T> {
  [key: string]: T
}

export function forOf<T>(
  target: Dict<T>
): Array<T> {
  return Object.keys(target).map(key => target[key]);
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
// export function replaceBy<T, K extends keyof T>(

// )