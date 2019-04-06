export interface Dict<T> {
  [key: string]: T
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