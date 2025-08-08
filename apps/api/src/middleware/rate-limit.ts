// import type { Request, Response, NextFunction } from "express";
// import IORedis from "ioredis";
// import {
//   RateLimiterRedis,
//   RateLimiterMemory,
//   type RateLimiterRes,
// } from "rate-limiter-flexible";

// // Initialize Redis client if REDIS_URL is present; otherwise fall back to in-memory limiter
// let redis: IORedis | null = null;
// if (process.env.REDIS_URL) {
//   try {
//     redis = new IORedis(process.env.REDIS_URL, {
//       maxRetriesPerRequest: 2,
//       enableOfflineQueue: false,
//       lazyConnect: true,
//     });
//     // Best-effort connect (non-blocking) to surface errors early in logs
//     redis.connect().catch((err) => {
//       console.error("[RateLimit] Redis connect error:", err?.message || err);
//     });
//   } catch (err) {
//     console.error("[RateLimit] Failed to initialize Redis:", err);
//     redis = null;
//   }
// }

// export type LimitConfig = {
//   points: number; // max requests allowed in window
//   duration: number; // seconds in window
//   blockDuration?: number; // optional penalty seconds after exceeding
//   keyGenerator?: (req: Request) => string; // override default key builder
//   skip?: (req: Request) => boolean; // skip limiting for some requests
//   exposeHeaders?: boolean; // default true: set X-RateLimit-* headers
// };

// // Build a limiter instance, using Redis if available, else memory fallback
// function buildLimiter(points: number, duration: number, blockDuration = 0) {
//   if (redis) {
//     return new RateLimiterRedis({
//       storeClient: redis,
//       points,
//       duration,
//       blockDuration,
//       execEvenly: true,
//     });
//   }
//   return new RateLimiterMemory({ points, duration, blockDuration, execEvenly: true });
// }

// // Extract best-effort client identity behind Cloudflare/NGINX
// function defaultKeyFromRequest(req: Request): string {
//   // Prefer authenticated user id if middleware attached it
//   const userId = (req as any).userId as string | undefined;
//   if (userId) return `user:${userId}`;

//   // Then API key if provided
//   const apiKey = (req.headers["x-api-key"] as string) || undefined;
//   if (apiKey) return `key:${apiKey}`;

//   // Then client IP from Cloudflare / reverse proxy
//   const cfIp = (req.headers["cf-connecting-ip"] as string) || undefined;
//   const realIp = (req.headers["x-real-ip"] as string) || undefined;
//   const ip = cfIp || realIp || req.ip || req.socket.remoteAddress || "unknown";
//   return `ip:${ip}`;
// }

// export function makeRateLimiter(config: LimitConfig) {
//   const limiter = buildLimiter(
//     config.points,
//     config.duration,
//     config.blockDuration ?? 0
//   );

//   const expose = config.exposeHeaders ?? true;

//   return async function rateLimit(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       // Skip OPTIONS by default to avoid CORS issues
//       if (req.method === "OPTIONS") return next();
//       if (config.skip && config.skip(req)) return next();

//       const key = config.keyGenerator
//         ? config.keyGenerator(req)
//         : defaultKeyFromRequest(req);

//       const rlRes: RateLimiterRes = await (limiter as any).consume(key);

//       if (expose) {
//         res.setHeader("X-RateLimit-Limit", String(config.points));
//         res.setHeader("X-RateLimit-Remaining", String(rlRes.remainingPoints));
//         res.setHeader(
//           "X-RateLimit-Reset",
//           String(Math.ceil((Date.now() + rlRes.msBeforeNext) / 1000))
//         );
//       }

//       return next();
//     } catch (err: any) {
//       // Limited
//       const ms = err?.msBeforeNext ?? 1000;
//       const secs = Math.max(1, Math.ceil(ms / 1000));
//       res.setHeader("Retry-After", String(secs));
//       if (expose) {
//         res.setHeader("X-RateLimit-Limit", String(config.points));
//         res.setHeader("X-RateLimit-Remaining", "0");
//         res.setHeader(
//           "X-RateLimit-Reset",
//           String(Math.ceil((Date.now() + ms) / 1000))
//         );
//       }
//       return res.status(429).json({
//         error: "Too many requests",
//         retryAfterSeconds: secs,
//       });
//     }
//   };
// }

// // Helpers for common patterns
// export const keyByNormalizedEmail = (field = "email") => (req: Request) => {
//   const emailRaw = (req.body?.[field] || req.query?.[field] || "") as string;
//   const email = String(emailRaw).trim().toLowerCase();
//   return email ? `acct:${email}` : defaultKeyFromRequest(req);
// };

// export const skipHealthAndMetrics = (paths: string[] = [
//   "/v1/health",
//   "/v1/status",
// ]) => (req: Request) => paths.includes(req.path);
