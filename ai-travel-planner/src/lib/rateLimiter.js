// lib/rateLimiter.js - Rate limiting implementation for API protection

const rateLimit = new Map();

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */
export function rateLimiter(identifier, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get existing requests for this identifier
  const requests = rateLimit.get(identifier) || [];

  // Filter out requests outside the current window
  const validRequests = requests.filter((timestamp) => timestamp > windowStart);

  // Check if limit is exceeded
  if (validRequests.length >= limit) {
    // Update the map with filtered requests
    rateLimit.set(identifier, validRequests);
    return false; // Rate limit exceeded
  }

  // Add current request timestamp
  validRequests.push(now);
  rateLimit.set(identifier, validRequests);

  return true; // Request allowed
}

/**
 * Advanced rate limiter with different limits for different endpoints
 */
export class AdvancedRateLimiter {
  constructor() {
    this.limits = new Map();
    this.defaultConfig = {
      requests: 100,
      window: 900000, // 15 minutes
      blockDuration: 300000, // 5 minutes
    };

    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 300000);
  }

  /**
   * Set rate limit for specific endpoint
   */
  setLimit(endpoint, config) {
    this.limits.set(endpoint, {
      ...this.defaultConfig,
      ...config,
    });
  }

  /**
   * Check if request should be allowed
   */
  isAllowed(identifier, endpoint = "default") {
    const config = this.limits.get(endpoint) || this.defaultConfig;
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();

    if (!rateLimit.has(key)) {
      rateLimit.set(key, {
        requests: [],
        blockedUntil: null,
      });
    }

    const data = rateLimit.get(key);

    // Check if currently blocked
    if (data.blockedUntil && now < data.blockedUntil) {
      return {
        allowed: false,
        resetTime: data.blockedUntil,
        reason: "blocked",
      };
    }

    // Remove old requests outside the window
    const windowStart = now - config.window;
    data.requests = data.requests.filter(
      (timestamp) => timestamp > windowStart
    );

    // Check if limit exceeded
    if (data.requests.length >= config.requests) {
      // Block the identifier
      data.blockedUntil = now + config.blockDuration;

      return {
        allowed: false,
        resetTime: data.blockedUntil,
        reason: "rate_limit_exceeded",
        requestCount: data.requests.length,
        limit: config.requests,
      };
    }

    // Add current request
    data.requests.push(now);
    data.blockedUntil = null; // Clear any previous block

    return {
      allowed: true,
      remaining: config.requests - data.requests.length,
      resetTime: windowStart + config.window,
      requestCount: data.requests.length,
    };
  }

  /**
   * Clean up old entries
   */
  cleanup() {
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, data] of rateLimit.entries()) {
      // Remove entries older than 24 hours
      if (data.requests && data.requests.length > 0) {
        const latestRequest = Math.max(...data.requests);
        if (latestRequest < cutoff) {
          rateLimit.delete(key);
        }
      }

      // Remove expired blocks
      if (data.blockedUntil && data.blockedUntil < now) {
        data.blockedUntil = null;
      }
    }
  }

  /**
   * Get current status for identifier
   */
  getStatus(identifier, endpoint = "default") {
    const config = this.limits.get(endpoint) || this.defaultConfig;
    const key = `${identifier}:${endpoint}`;
    const data = rateLimit.get(key);

    if (!data) {
      return {
        requestCount: 0,
        remaining: config.requests,
        blocked: false,
      };
    }

    const now = Date.now();
    const windowStart = now - config.window;
    const validRequests = data.requests.filter(
      (timestamp) => timestamp > windowStart
    );

    return {
      requestCount: validRequests.length,
      remaining: Math.max(0, config.requests - validRequests.length),
      blocked: data.blockedUntil && now < data.blockedUntil,
      blockedUntil: data.blockedUntil,
    };
  }
}

// Create global instance
export const advancedRateLimiter = new AdvancedRateLimiter();

// Set up endpoint-specific limits
advancedRateLimiter.setLimit("auth/signup", {
  requests: 5,
  window: 900000, // 15 minutes
  blockDuration: 900000, // 15 minutes
});

advancedRateLimiter.setLimit("auth/signin", {
  requests: 10,
  window: 900000, // 15 minutes
  blockDuration: 600000, // 10 minutes
});

advancedRateLimiter.setLimit("api/generate-trip", {
  requests: 20,
  window: 3600000, // 1 hour
  blockDuration: 300000, // 5 minutes
});

advancedRateLimiter.setLimit("api/bookings", {
  requests: 50,
  window: 3600000, // 1 hour
  blockDuration: 300000, // 5 minutes
});

/**
 * Express middleware for rate limiting
 */
export function rateLimitMiddleware(endpoint = "default") {
  return (req, res, next) => {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const result = advancedRateLimiter.isAllowed(identifier, endpoint);

    // Add rate limit headers
    res.setHeader("X-RateLimit-Remaining", result.remaining || 0);
    res.setHeader("X-RateLimit-Reset", result.resetTime || Date.now());

    if (!result.allowed) {
      res.setHeader("X-RateLimit-Limit", result.limit || 0);
      res.setHeader(
        "Retry-After",
        Math.ceil((result.resetTime - Date.now()) / 1000)
      );

      return res.status(429).json({
        error: "Too Many Requests",
        message:
          result.reason === "blocked"
            ? "You have been temporarily blocked due to excessive requests"
            : "Rate limit exceeded. Please try again later.",
        retryAfter: result.resetTime,
        requestCount: result.requestCount,
      });
    }

    res.setHeader(
      "X-RateLimit-Limit",
      result.limit || advancedRateLimiter.defaultConfig.requests
    );
    next();
  };
}

/**
 * Next.js API route wrapper for rate limiting
 */
export function withRateLimit(handler, endpoint = "default") {
  return async (req, res) => {
    const identifier =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      "unknown";
    const result = advancedRateLimiter.isAllowed(identifier, endpoint);

    // Add rate limit headers
    res.setHeader("X-RateLimit-Remaining", result.remaining || 0);
    res.setHeader("X-RateLimit-Reset", result.resetTime || Date.now());

    if (!result.allowed) {
      res.setHeader("X-RateLimit-Limit", result.limit || 0);
      res.setHeader(
        "Retry-After",
        Math.ceil((result.resetTime - Date.now()) / 1000)
      );

      return res.status(429).json({
        error: "Too Many Requests",
        message:
          result.reason === "blocked"
            ? "You have been temporarily blocked due to excessive requests"
            : "Rate limit exceeded. Please try again later.",
        retryAfter: result.resetTime,
        requestCount: result.requestCount,
      });
    }

    res.setHeader(
      "X-RateLimit-Limit",
      result.limit || advancedRateLimiter.defaultConfig.requests
    );

    // Call the original handler
    return handler(req, res);
  };
}

/**
 * Rate limiter for specific user actions
 */
export class UserActionLimiter {
  constructor() {
    this.userLimits = new Map();
  }

  /**
   * Check if user action is allowed
   */
  isActionAllowed(userId, action, limit = 5, windowMs = 3600000) {
    // 1 hour default
    const key = `${userId}:${action}`;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.userLimits.has(key)) {
      this.userLimits.set(key, []);
    }

    const actions = this.userLimits.get(key);

    // Filter out old actions
    const validActions = actions.filter((timestamp) => timestamp > windowStart);

    if (validActions.length >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: windowStart + windowMs,
      };
    }

    // Add current action
    validActions.push(now);
    this.userLimits.set(key, validActions);

    return {
      allowed: true,
      remaining: limit - validActions.length,
      resetTime: windowStart + windowMs,
    };
  }

  /**
   * Reset limits for a specific user action
   */
  resetUserAction(userId, action) {
    const key = `${userId}:${action}`;
    this.userLimits.delete(key);
  }

  /**
   * Clean up old user actions
   */
  cleanup() {
    const now = Date.now();
    const cutoff = now - 24 * 60 * 60 * 1000; // 24 hours

    for (const [key, actions] of this.userLimits.entries()) {
      if (actions.length > 0) {
        const latestAction = Math.max(...actions);
        if (latestAction < cutoff) {
          this.userLimits.delete(key);
        }
      }
    }
  }
}

// Create global user action limiter
export const userActionLimiter = new UserActionLimiter();

// Clean up every hour
setInterval(() => {
  userActionLimiter.cleanup();
}, 3600000);

/**
 * Distributed rate limiter using Redis (for production)
 * Uncomment and configure if using Redis
 */

import Redis from "ioredis";

export class RedisRateLimiter {
  constructor(redisClient) {
    this.redis = redisClient || new Redis(process.env.REDIS_URL);
  }

  async isAllowed(identifier, limit = 100, windowMs = 900000) {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const windowKey = `${key}:${window}`;

    const pipeline = this.redis.pipeline();
    pipeline.incr(windowKey);
    pipeline.expire(windowKey, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();
    const requestCount = results[0][1];

    if (requestCount > limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: (window + 1) * windowMs,
        requestCount,
      };
    }

    return {
      allowed: true,
      remaining: limit - requestCount,
      resetTime: (window + 1) * windowMs,
      requestCount,
    };
  }

  async getStatus(identifier, windowMs = 900000) {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const windowKey = `${key}:${window}`;

    const requestCount = (await this.redis.get(windowKey)) || 0;

    return {
      requestCount: parseInt(requestCount),
      resetTime: (window + 1) * windowMs,
    };
  }
}
