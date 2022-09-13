import { Request } from "express";

export interface AuthUser {
  token: string;
}

export async function expressAuthentication(
  req: Request,
  securityName: string,
  scopes?: string[]
) {
  if (securityName === "api_key") {
    const token = req.headers.authorization;
    return { token };
  }
}
