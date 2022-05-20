import { DateInterval, FetchCommandInstance, RequiredKeys } from "@better-typed/hyper-fetch";

import { UseFetchOptionsType } from "use-fetch";

type DefaultOptionsType = RequiredKeys<Omit<UseFetchOptionsType<FetchCommandInstance>, "initialData">> & {
  initialData: null;
};

export const useFetchDefaultOptions: DefaultOptionsType = {
  dependencies: [],
  disabled: false,
  dependencyTracking: true,
  revalidateOnMount: true,
  initialData: null,
  refresh: false,
  refreshTime: DateInterval.hour,
  refreshBlurred: false,
  refreshOnTabBlur: false,
  refreshOnTabFocus: false,
  refreshOnReconnect: false,
  debounce: false,
  debounceTime: 400,
  deepCompare: true,
};
