import type { Request, Response } from "express";
import { databaseHealthCheck, cacheHealthCheck } from "checks";

export type CustomErrorProps = {
    message: string;
    status: number;
};

export class CustomError extends Error {
    status: number;

    constructor({ message, status }: CustomErrorProps) {
        super(message);
        this.status = status;
    }
}

export const healthCheckHandler = async (
    request: Request,
    response: Response
) => {
    try {
        const databaseIsHealthy = await databaseHealthCheck();
        const cacheIsHealthy = await cacheHealthCheck();
        if (!databaseIsHealthy && !cacheIsHealthy) {
            throw new CustomError({
                status: 500,
                message: "Database and cache are not healthy",
            });
        } else if (!databaseIsHealthy) {
            throw new CustomError({
                status: 500,
                message: "Database is not healthy",
            });
        } else if (!cacheIsHealthy) {
            throw new CustomError({
                status: 500,
                message: "Cache is not healthy",
            });
        }
        const status = 200;
        const message = "Database and cache are healthy";
        return response.status(status).send({
            status,
            message,
        });
    } catch (error) {
        const { status, message } = error as CustomError;
        return response.status(status).send({
            status,
            message,
        });
    }
};
