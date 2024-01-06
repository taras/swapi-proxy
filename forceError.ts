import {
  STATUS_CODE,
  STATUS_TEXT
} from "https://deno.land/std@0.211.0/http/status.ts";
import { HTTPMiddleware } from "revolution";

export const forceError: HTTPMiddleware = function* (request, next) {
  const { searchParams } = new URL(request.url);

  const status = searchParams.get("status");
  if (status) {
    const code = parseInt(status);
    if (code in STATUS_TEXT) {
      return new Response(STATUS_TEXT[<keyof typeof STATUS_TEXT>code], {
        status: code,
      });
    }
    return new Response(
      `${STATUS_TEXT[STATUS_CODE.BadRequest]}: "${status}" is not a valid HTTP status. Expected one of ${Object.keys(
        STATUS_TEXT
      ).join(", ")}`,
      {
        status: STATUS_CODE.BadRequest,
      }
    );
  }

  return yield* next(request);
};
