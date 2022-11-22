import { Request } from "express";
import { ForbiddenError } from "../errors/forbidden-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { AuthService } from "../services/auth-service";
import { AuthorizationService } from "../services/authorization-service";

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
    if (!token) throw new UnauthorizedError();
    const { status, data: userInfo } = await AuthService.getUserInfo(token);
    console.log(status, userInfo)
    if (status !== 200) throw new ForbiddenError();
    if (!AuthorizationService.hasRole(userInfo, scopes)) throw new ForbiddenError();
    return { token, userInfo };
  }
}
