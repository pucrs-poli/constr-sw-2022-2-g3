import { Express, NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

export function RegisterErrorHandler(app: Express) {
    app.use(function errorHandler(
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(400).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }
        if (err instanceof Error) {
            console.error("Unhandled error:", err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }

        next();
    });
}
