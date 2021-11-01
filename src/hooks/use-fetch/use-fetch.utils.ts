import { CacheValueType } from "cache";

export const getCacheState = (
  cacheData: CacheValueType | undefined,
  useOnMount: boolean,
  cacheTime: number,
): CacheValueType | undefined => {
  if (useOnMount && cacheData && +cacheData.timestamp + cacheTime < +new Date()) {
    return cacheData;
  }
  return undefined;
};