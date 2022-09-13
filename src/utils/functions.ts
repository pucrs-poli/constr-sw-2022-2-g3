import { Request } from "express";

export function extractToken(req: Request) {
    return req.headers.authorization!;
}
