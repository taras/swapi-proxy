import { sleep } from "effection";
import { HTTPMiddleware } from "revolution";

export const forceDelay: HTTPMiddleware = function* (request, next) {
  const { searchParams } = new URL(request.url);

  const delay = searchParams.get("delay");
  if (delay) {
    searchParams.delete("delay");
    yield* sleep(parseInt(delay));
  }

  return yield* next(request);
};
