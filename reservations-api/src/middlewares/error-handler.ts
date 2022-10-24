import { Express, NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { ConflictError } from "../errors/conflict-error";
import { ForbiddenError } from "../errors/forbidden-error";
import { InvalidEmailError } from "../errors/invalid-email-error";
import { NotFoundError } from "../errors/non-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";

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
        if (err instanceof InvalidEmailError) {
            console.warn(`Caught Validation Error for email:`, err.email);
            return res.status(400).json({
                message: "Validation Failed",
                details: {
                    'user.email': {
                        message: 'Invalid email'
                    },
                },
            });
        }
        if (err instanceof ConflictError) {
            return res.status(409).json({
                message: "Conflict Error",
            });
        }
        if (err instanceof NotFoundError) {
            return res.status(404).json({
                message: "Not Found",
            });
        }
        if (err instanceof ForbiddenError) {
            return res.status(403).json({
                message: "Forbidden Error",
            });
        }
        if (err instanceof UnauthorizedError) {
            return res.status(401).json({
                message: "Unauthorized Error",
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
