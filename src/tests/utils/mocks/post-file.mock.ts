import { DateInterval } from "index";
import { createInterceptor, ErrorCodesType, testMiddleware } from "tests/utils/server";
import { buildMock } from ".";

export const postFile = testMiddleware<number, FormData>()({
  endpoint: "/",
  options: {
    timeout: DateInterval.second * 1,
  },
});

export const postFileMock = buildMock(postFile, 1);

export const interceptPostFile = <StatusType extends number | ErrorCodesType>(status: StatusType, delay?: number) =>
  createInterceptor(postFileMock, status, delay);