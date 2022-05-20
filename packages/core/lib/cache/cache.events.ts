import EventEmitter from "events";

import { CacheValueType, getRevalidateEventKey, CacheStorageType } from "cache";
import { ExtractResponse, ExtractError } from "types";
import { getCacheKey } from "./cache.utils";

export const getCacheEvents = (emitter: EventEmitter, storage: CacheStorageType) => ({
  set: <T>(cacheKey: string, data: CacheValueType<ExtractResponse<T>, ExtractError<T>>): void => {
    emitter.emit(getCacheKey(cacheKey), data);
  },
  /**
   * Revalidate cache values and trigger revalidate event
   * @param pattern Allow to revalidate cache based on the `cacheKey`, `string pattern` or `regexp` pattern for matching
   */
  revalidate: async (pattern: string | RegExp): Promise<void> => {
    const keys = await storage.keys();

    if (typeof pattern === "string") {
      emitter.emit(getRevalidateEventKey(pattern));
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const entityKey of keys) {
        if (pattern.test(entityKey)) {
          emitter.emit(getRevalidateEventKey(entityKey));
        }
      }
    }
  },
  get: <T>(
    cacheKey: string,
    callback: (data: CacheValueType<ExtractResponse<T>, ExtractError<T>>) => void,
  ): VoidFunction => {
    emitter.on(getCacheKey(cacheKey), callback);
    return () => emitter.removeListener(getCacheKey(cacheKey), callback);
  },
  onRevalidate: (cacheKey: string, callback: () => void): VoidFunction => {
    emitter.on(getRevalidateEventKey(cacheKey), callback);
    return () => emitter.removeListener(getRevalidateEventKey(cacheKey), callback);
  },
});
