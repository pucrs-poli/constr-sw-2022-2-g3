import { Express, NextFunction, Request, Response } from "express";

export function RegisterErrorHandler(app: Express) {
    app.use(function errorHandler(
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (err instanceof Error) {
            console.error("Unhandled error:", err);
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }

        next();
    });
}
