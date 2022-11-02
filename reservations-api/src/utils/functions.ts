import { Request } from "express";

export function extractToken(req: Request) {
    return req.headers.authorization!;
}

export async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
