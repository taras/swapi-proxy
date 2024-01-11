import { call } from "effection";
import { HTTPMiddleware } from "revolution";
import edge_cors from "edge_cors";

export const cors: HTTPMiddleware = function* (request, next) {
  const response = yield* next(request);
  return yield* call(edge_cors(request, new Response(response.body, response)));
}