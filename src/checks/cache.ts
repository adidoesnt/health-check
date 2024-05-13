import { createClient, type RedisClientOptions } from "redis";
import { getLogger } from "utils";

const logger = getLogger("cache");

const {
    CACHE_HOST: host = "dummy-host",
    CACHE_PORT: port = 6379,
    CACHE_ENABLE_TLS = "true",
    CACHE_PASSWORD: password = "",
} = process.env;
const tls = CACHE_ENABLE_TLS === "true";

const config: RedisClientOptions = {
    socket: {
        host,
        port: Number(port),
        tls,
    },
    password,
};

const getCache = async () => {
    const cache = createClient(config);
    cache.on("connect", () => {
        logger.info(`Connected to Redis server on port ${port}`);
    });
    cache.on("error", (err) => {
        logger.error("Error connecting to Redis server:", err);
    });
    return cache;
};

const redis = await getCache();

export const cacheHealthCheck = async () => {
    try {
        await redis.connect();
        logger.info("Cache connection has been established successfully.");
        return true;
    } catch (error) {
        logger.error("Unable to connect to the cache:", error);
        return false;
    }
};
