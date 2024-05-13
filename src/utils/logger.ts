import log4js from "log4js";

export const getLogger = (name: string) => {
    const logger = log4js.getLogger(name);
    logger.level = "debug";
    return logger;
};
