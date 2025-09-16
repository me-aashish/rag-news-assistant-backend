import Redis from "ioredis";
import { config } from "../config/index.js";

const redis = new Redis(config.REDIS_URL);
const historyKey = (sessionId) => `session:${sessionId}:history`;

export async function pushHistory(sessionId, messageObj) {
  await redis.rpush(historyKey(sessionId), JSON.stringify(messageObj));
  await redis.expire(historyKey(sessionId), config.SESSION_TTL_SECONDS);
}

export async function getHistory(sessionId) {
  const items = await redis.lrange(historyKey(sessionId), 0, -1);
  return items.map((s) => JSON.parse(s));
}

export async function clearHistory(sessionId) {
  await redis.del(historyKey(sessionId));
}

export default redis;
