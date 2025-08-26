import { createClient } from "redis";
const redisClient = createClient({
  url: process.env.REDIS_URL
});
const getRedisClient = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
  return redisClient;
};

export default getRedisClient;
