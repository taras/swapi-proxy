import { call, main, sleep, Operation, suspend, useAbortSignal } from "effection";

import { createRevolution, route } from "revolution";

main(function* () {
  const revolution = createRevolution({
    app: [
      route<Response>("/(.*)", function* (request): Operation<Response> {
        const { pathname, searchParams } = new URL(request.url);
        const signal = yield* useAbortSignal();

        const delay = searchParams.get("delay");
        if (delay) {
          searchParams.delete("delay")
          yield* sleep(parseInt(delay));
        }

        return yield* call(fetch(new URL(`${pathname}?${searchParams}`, "https://swapi.py4e.com"), {
          method: request.method,
          headers: request.headers,
          body: request.body,
          redirect: 'manual',
          signal,
        }));
      }),
    ],
  });

  const server = yield* revolution.start();
  console.log(`www -> http://${server.hostname}:${server.port}`);

  yield* suspend();
});
