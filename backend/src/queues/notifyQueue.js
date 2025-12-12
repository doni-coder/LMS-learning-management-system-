import { Queue } from "bullmq"
import { redis } from "../utils/redisClient.utils.js"

export const notifyQueue = new Queue("emailQueue", {
    connection: redis,
});