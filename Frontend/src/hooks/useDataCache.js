import { useState, useCallback, useEffect } from 'react';

// Hook para cache de datos con expiración
export const useDataCache = () => {
  const [cache, setCache] = useState(new Map());

  const getCachedData = useCallback((key) => {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    // Limpiar datos expirados
    if (cached) {
      cache.delete(key);
    }
    return null;
  }, [cache]);

  const setCachedData = useCallback((key, data, ttl = 5 * 60 * 1000) => {
    const expiry = Date.now() + ttl;
    setCache(prev => new Map(prev).set(key, { data, expiry }));
  }, []);

  const updateCachedData = useCallback((key, updater) => {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      const newData = updater(cached.data);
      setCachedData(key, newData, cached.expiry - Date.now());
    }
  }, [cache, setCachedData]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    getCachedData,
    setCachedData,
    updateCachedData,
    clearCache
  };
};

// Hook para debounce
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
