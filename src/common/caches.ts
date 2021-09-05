class Cache {
  _cache: Storage;
  _prefix = 'lscache-';

  constructor(type: 'local' | 'session') {
    if (type === 'local') {
      this._cache = localStorage;
    } else {
      this._cache = sessionStorage;
    }
  }

  set<T = any>(k: string, v: T) {
    this._cache.setItem(`${this._prefix}${k}`, JSON.stringify(v));
  }

  get<T = any>(k: string): T | null {
    const key = `${this._prefix}${k}`;
    const str = this._cache.getItem(key);
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      this._cache.removeItem(key);
      return null;
    }
  }

  delete(key: string) {
    this._cache.removeItem(key);
  }
}

export const lscache = new Cache('local');
export const sscache = new Cache('session');
