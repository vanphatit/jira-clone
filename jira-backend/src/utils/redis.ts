import { createClient } from "redis";

export const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error", (err) => console.error("❌ Redis Error:", err));
redis.connect();
