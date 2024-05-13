import { Sequelize } from "sequelize-typescript";
import type { Dialect, Options } from "sequelize";
import { getLogger } from "utils";

const logger = getLogger("database");
const logging = (msg: string) => logger.debug(msg);

const {
    DB_USER: username = "postgres",
    DB_HOST: host = "localhost",
    DB_PORT: port = 5432,
    DB_PASSWORD: password = "",
    DB_DATABASE: database = "dummy-database",
    ENCODED_CERT: certificate = "dummy-cert",
} = process.env;

const decodedCert = Buffer.from(certificate, "base64").toString("ascii");

const config: Options = {
    dialect: "postgres" as Dialect,
    logging,
    host,
    port: Number(port),
    database,
    username,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
            ca: decodedCert,
        },
    },
    password,
};

const sequelize = new Sequelize(config);

export const databaseHealthCheck = async () => {
    try {
        await sequelize.authenticate();
        logger.info("Database connection has been established successfully.");
        return true;
    } catch (error) {
        logger.error("Unable to connect to the database:", error);
        return false;
    }
};
