import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis';

export const apiLimiter = rateLimit({
    store: process.env.NODE_ENV === 'test'
        ? undefined // Use default MemoryStore for tests
        : new RedisStore({
            sendCommand: (...args: string[]) => redisClient.sendCommand(args),
        }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 'error',
        message: 'Too many requests, please try again later.'
    }
});
