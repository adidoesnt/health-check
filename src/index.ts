import express from "express";
import { json, urlencoded } from "body-parser";
import { healthCheckHandler } from "handlers/health";

const { HEALTH_CHECK_ENDPOINT = "/", PORT = "8080" } = process.env;
const port = parseInt(PORT, 10);

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));

app.get(HEALTH_CHECK_ENDPOINT, async (req, res) => {
    return await healthCheckHandler(req, res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
