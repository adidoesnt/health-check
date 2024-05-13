import express from "express";
import { json, urlencoded } from "body-parser";
import { healthCheckHandler } from "handlers/health";
import { getLogger } from "utils";

const logger = getLogger("server");

const { SERVER_HEALTH_CHECK_ENDPOINT: endpoint = "/", SERVER_PORT = "8080" } =
    process.env;
const port = parseInt(SERVER_PORT, 10);

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

app.get(endpoint, async (req, res) => {
    return await healthCheckHandler(req, res);
});

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
