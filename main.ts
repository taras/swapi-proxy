import { Operation, call, main, suspend } from "effection";

import { createRevolution, route } from "revolution";
import { forceError } from "./forceError.ts";
import { forceDelay } from "./forceDelay.ts";

await main(function* (): Operation<void> {
  const revolution = createRevolution({
    app: [
      forceDelay,
      forceError,
      route<Response>("/(.*)", function* (request) {
        const { pathname, searchParams } = new URL(request.url);
        return yield* call(
          fetch(
            new URL(`${pathname}?${searchParams}`, "https://swapi.py4e.com"),
            {
              method: request.method,
              headers: request.headers,
              body: request.body,
              redirect: "manual",
              signal: request.signal,
            }
          )
        );
      }),
    ],
  });

  const server = yield* revolution.start();
  console.log(`www -> http://${server.hostname}:${server.port}`);

  yield* suspend();
});
