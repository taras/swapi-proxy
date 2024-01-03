import { call, main, sleep, Operation, suspend, useAbortSignal } from "effection";

import { createRevolution, route } from "revolution";

await main(function* () {
  const revolution = createRevolution({
    app: [
      route<Response>("/(.*)", function* (request): Operation<Response> {
        const { pathname, searchParams } = new URL(request.url);

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
        }));
      }),
    ],
  });

  const server = yield* revolution.start();
  console.log(`www -> http://${server.hostname}:${server.port}`);

  yield* suspend();
});
