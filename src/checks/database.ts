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

const runTestQuery = async (sequelize: Sequelize) => {
    const result = await sequelize.query(
        "SELECT 'database is healthy' AS data;"
    );
    const { data } = result[0][0] as { data: string };
    if (data !== "database is healthy") {
        throw new Error("Database test query result is not as expected.");
    }
    logger.debug("Database query result:", data);
};

export const databaseHealthCheck = async () => {
    try {
        const sequelize = new Sequelize(config);
        await sequelize.authenticate();
        logger.info("Database connection has been established successfully.");
        await runTestQuery(sequelize);
        logger.debug("Successully ran test query on the database.");
        await sequelize.close();
        logger.debug("Database connection has been closed successfully.");
        return true;
    } catch (error) {
        logger.error("Unable to connect to the database:", error);
        return false;
    }
};
