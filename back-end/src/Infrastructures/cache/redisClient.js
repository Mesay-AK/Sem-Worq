import Redis from "ioredis";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This tells node exactly where the .env is, relative to the file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: {
    rejectUnauthorized: false,
  },
});

redisClient.on("connect", () => {
  console.log("Connected to Redis Cloud");
});

// const {keys, err} = redisClient.Keys(ctx, "*").Result()
// if (err != nil ){
//    log.Fatal(err)
// }
// fmt.Println(keys)

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redisClient;
