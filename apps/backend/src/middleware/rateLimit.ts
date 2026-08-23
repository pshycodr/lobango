import type { ORPCContext } from "@/orpc/context";
import { ORPCError, os } from "@orpc/server";

interface RateLimitOptions<TInput> {
  key: (input: TInput, context: ORPCContext) => string;
  limit: number;
  windowSeconds: number;
}

export function rateLimit<TInput = unknown>(options: RateLimitOptions<TInput>) {
  return os
    .$context<ORPCContext>()
    .middleware(async ({ context, next }, input: TInput) => {
      const cacheKey = `ratelimit:${options.key(input, context)}`;
      const current = (await context.cache.get<number>(cacheKey)) ?? 0;

      if (current >= options.limit) {
        throw new ORPCError("TOO_MANY_REQUESTS", {
          message: "Too many requests, please try again shortly.",
        });
      }

      await context.cache.set(cacheKey, current + 1, options.windowSeconds);

      return next();
    });
}

export const strictRateLimit = <TInput>(
  key: (input: TInput, context: ORPCContext) => string
) =>
  rateLimit<TInput>({
    key: (input, context) => `strict:${key(input, context)}`,
    limit: 5,
    windowSeconds: 60,
  });

export const moderateRateLimit = <TInput>(
  key: (input: TInput, context: ORPCContext) => string
) =>
  rateLimit<TInput>({
    key: (input, context) => `moderate:${key(input, context)}`,
    limit: 30,
    windowSeconds: 60,
  });
