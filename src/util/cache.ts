class Cache<T, K extends string = string> {
  private _cache: Record<K, T>;

  constructor(
    init = {} as Record<K, T>
  ) {
    this._cache = init;
  }

  clear() {
    this._cache = {} as Record<K, T>;
  }

  delete(key: K): T | undefined {
    const toDelete = this._cache[key];
    delete this._cache[key];
    return toDelete;
  }

  get(key: K): T | undefined {
    return this._cache[key];
  }

  getAll(): Array<T> {
    return Object.keys(this._cache).map(key => this._cache[key as K]);
  }

  has(key: K): boolean {
    return key in this._cache;
  }

  get length(): number {
    return Object.keys(this._cache).length;
  }

  set(key: K, data: T): T {
    return this._cache[key] = data;
  }
}

export default Cache;