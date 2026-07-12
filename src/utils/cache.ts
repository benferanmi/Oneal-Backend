const cache = new Map<string, { value: any; expiresAt: number }>();

export function getCache(key: string): any | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cache.delete(key);
    return null;
  }
  return item.value;
}

export function setCache(key: string, value: any, ttlSeconds: number = 3600): void {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function clearCache(key: string): void {
  cache.delete(key);
}
